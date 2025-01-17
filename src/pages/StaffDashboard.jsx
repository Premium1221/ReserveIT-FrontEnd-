import React, {useCallback, useEffect, useState} from 'react';
import { Calendar, Clock, Users, CheckCircle, XCircle, Mail, Phone,Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from "@/context/AuthContext";
import api from '../config/axiosConfig';
import { connectWebSocket } from "@/config/websocketConfig.jsx";
import './StaffDashboard.css';

const StaffDashboard = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [selectedDate, setSelectedDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchReservations = useCallback(async () => {
        if (!user?.companyId) return;

        try {
            setLoading(true);
            const response = await api.get(`/staff/reservations/company/${user.companyId}`);
            console.log('Received reservations:', response.data);
            setReservations(response.data);
        } catch (err) {
            toast.error('Failed to fetch reservations');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.companyId]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const handleTableUpdate = useCallback(() => {
        fetchReservations();
    }, [fetchReservations]);

    useEffect(() => {
        if (!user?.companyId) return;

        const cleanup = connectWebSocket(
            user.companyId,
            handleTableUpdate,
            () => {}
        );

        return () => {
            if (cleanup) cleanup();
        };
    }, [user?.companyId, handleTableUpdate]);

    const handleCheckIn = async (id) => {
        try {
            const response = await api.post(`/staff/reservations/${id}/check-in`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                toast.success('Guest checked in successfully');
            }
        } catch (err) {
            console.error('Check-in error:', err.response || err);
            const errorMessage = err.response?.data?.message
                || err.response?.data
                || 'Failed to check in guest';
            toast.error(errorMessage);

            if (err.response?.status === 401 || err.response?.status === 403) {
                toast.error('Session expired. Please log in again.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        }
    };

    const handleExtendTime = async (id, duration) => {
        try {
            await api.post(`/staff/reservations/${id}/extend`, { duration });
            toast.success('Reservation time extended successfully');
            await fetchReservations();
        } catch (err) {
            toast.error('Failed to extend reservation time');
        }
    };

    const handleCheckOut = async (id) => {
        try {
            const response = await api.post(`/staff/reservations/${id}/check-out`);
            if (response.status === 200) {
                toast.success('Guest checked out successfully');
                await fetchReservations();
            }
        } catch (err) {
            toast.error(err.response?.data || 'Failed to check out guest');
        }
    };

    const handleNoShow = async (id) => {
        try {
            await api.post(`/staff/reservations/${id}/no-show`);
            toast.success('Guest marked as no-show');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to mark as no-show');
        }
    };

    const handleAction = async (id, action) => {
        if (loading) return;

        setLoading(true);
        try {
            if (action === 'check-in') {
                await handleCheckIn(id);
            } else if (action === 'no-show') {
                await handleNoShow(id);
            }
        } catch (error) {
            console.error('Action failed:', error);
            toast.error(error.response?.data?.message || 'Failed to process action');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    const filteredReservations = reservations.filter(reservation => {
        if (selectedStatus !== 'ALL' && reservation.status !== selectedStatus) {
            return false;
        }

        if (selectedDate) {
            const reservationDate = new Date(reservation.reservationDate).toLocaleDateString();
            const filterDate = new Date(selectedDate).toLocaleDateString();
            if (reservationDate !== filterDate) {
                return false;
            }
        }

        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            return reservation.customerName.toLowerCase().includes(searchLower) ||
                reservation.tableNumber.toString().includes(searchLower);
        }

        return true;
    });

    return (
        <div className="staff-dashboard">
            <h1>Staff Dashboard</h1>

            <div className="filters-container">
                <div className="filters-grid">
                    <div className="filter-item">
                        <label className="filter-label">Status</label>
                        <select
                            className="filter-select"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="ARRIVED">Arrived</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="NO_SHOW">No Show</option>
                        </select>
                    </div>

                    <div className="filter-item">
                        <label className="filter-label">Date</label>
                        <input
                            type="date"
                            className="filter-input"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    <div className="filter-item">
                        <label className="filter-label">Search</label>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by name or table..."
                                className="filter-input search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="search-icon" />
                        </div>
                    </div>

                    <div className="filter-item">
                        <button
                            onClick={() => {
                                setSelectedStatus('ALL');
                                setSelectedDate('');
                                setSearchQuery('');
                            }}
                            className="clear-filters-button"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="tab-controls">
                <button
                    className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming
                </button>
                <button
                    className={`tab ${activeTab === 'current' ? 'active' : ''}`}
                    onClick={() => setActiveTab('current')}
                >
                    Current
                </button>
                <button
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading reservations...</div>
            ) : filteredReservations.length === 0 ? (
                <p className="no-reservations">No reservations found</p>
            ) : (
                <div className="reservations-grid">
                    {filteredReservations.map(reservation => (
                        <div key={reservation.id} className="reservation-card">
                            <div className="reservation-header">
                                <h3>{`${reservation.userFirstName} ${reservation.userLastName}`}</h3>
                                <span className={`status-badge ${reservation.status.toLowerCase()}`}>
            {reservation.status}
        </span>
                            </div>

                            <div className="reservation-details">
                                <div className="detail-row">
                                    <Calendar size={16}/>
                                    <span>{formatDate(reservation.reservationDate)}</span>
                                </div>
                                <div className="detail-row">
                                    <Mail size={16}/>
                                    <span>Email: {reservation.userEmail}</span>
                                </div>
                                <div className="detail-row">
                                    <Phone size={16}/>
                                    <span>Phone: {reservation.userPhoneNumber}</span>
                                </div>
                                <div className="detail-row">
                                    <Clock size={16}/>
                                    <span>Duration: {reservation.durationMinutes} minutes</span>
                                </div>
                                <div className="detail-row">
                                    <Users size={16}/>
                                    <span>{reservation.numberOfPeople} guests</span>
                                </div>
                                <div className="table-info">
                                    <span>Table {reservation.tableNumber}</span>
                                </div>
                            </div>

                            <div className="reservation-actions">
                                {reservation.status === 'CONFIRMED' && (
                                    <>
                                        <button
                                            onClick={() => handleAction(reservation.id, 'check-in')}
                                            className="action-button check-in flex items-center gap-1"
                                            disabled={loading}
                                        >
                                            <CheckCircle size={16}/>
                                            Check In
                                        </button>
                                        <button
                                            onClick={() => handleAction(reservation.id, 'no-show')}
                                            className="action-button no-show flex items-center gap-1"
                                            disabled={loading}
                                        >
                                            <XCircle size={16}/>
                                            No Show
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;