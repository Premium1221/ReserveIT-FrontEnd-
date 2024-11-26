import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, RefreshCcw, AlertCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import api from '../config/axiosConfig.jsx';
import 'react-toastify/dist/ReactToastify.css';
import './MyReservations.css';

// Status Badge Component with PropTypes
const StatusBadge = ({ status }) => {
    const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        CONFIRMED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800',
        COMPLETED: 'bg-blue-100 text-blue-800'
    };

    return (
        <span className={`status-badge ${statusColors[status] || ''}`}>
            {status}
        </span>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.oneOf(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).isRequired
};

// Date formatting utility
const formatDate = (dateString) => {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {
                replace: true,
                state: { from: '/my-reservations' }
            });
            return;
        }
        fetchReservations();
    }, [isAuthenticated, navigate]);

    const fetchReservations = async (showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) setIsRefreshing(true);
            setError(null);

            const response = await api.get('/reservations');
            const sortedReservations = response.data
                .sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate));

            setReservations(sortedReservations);
        } catch (error) {
            console.error('Error fetching reservations', error);
            if (error.response?.status === 401) {
                logout();
                navigate('/login');
            } else {
                setError('Unable to load your reservations. Please try again.');
            }
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleCancelReservation = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) {
            return;
        }

        try {
            await api.delete(`/reservations/${id}`);
            setReservations(prev => prev.filter(res => res.id !== id));
            toast.success('Reservation cancelled successfully');
        } catch (error) {
            console.error('Error canceling reservation', error);
            toast.error('Failed to cancel reservation. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="reservations-loading">
                <div className="loading-spinner" />
                <p>Loading your reservations...</p>
            </div>
        );
    }

    return (
        <div className="my-reservations-container">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="reservations-header">
                <h1>My Reservations</h1>
                <button
                    onClick={() => fetchReservations(true)}
                    className="refresh-button"
                    disabled={isRefreshing}
                >
                    <RefreshCcw
                        className={isRefreshing ? 'animate-spin' : ''}
                        size={20}
                    />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                    <button onClick={() => fetchReservations(true)}>
                        Try Again
                    </button>
                </div>
            )}

            {!error && reservations.length === 0 ? (
                <div className="no-reservations">
                    <h3>No Reservations Found</h3>
                    <p>You have not made any reservations yet.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="make-reservation-btn"
                    >
                        Make Your First Reservation
                    </button>
                </div>
            ) : (
                <div className="reservations-grid">
                    {reservations.map((reservation) => (
                        <div
                            key={reservation.id}
                            className="reservation-card"
                        >
                            <div className="reservation-header">
                                <h3>{reservation.companyName || 'Unknown Restaurant'}</h3>
                                <StatusBadge status={reservation.status} />
                            </div>

                            <div className="reservation-details">
                                <div className="detail-item">
                                    <Calendar size={18} />
                                    <span>{formatDate(reservation.reservationDate)}</span>
                                </div>

                                <div className="detail-item">
                                    <Users size={18} />
                                    <span>
                                        {reservation.numberOfPeople}
                                        {reservation.numberOfPeople === 1 ? ' person' : ' people'}
                                    </span>
                                </div>

                                {reservation.tableNumber && (
                                    <div className="detail-item">
                                        <MapPin size={18} />
                                        <span>Table {reservation.tableNumber}</span>
                                    </div>
                                )}
                            </div>

                            {reservation.specialRequests && (
                                <div className="special-requests">
                                    <p>{reservation.specialRequests}</p>
                                </div>
                            )}

                            {['PENDING', 'CONFIRMED'].includes(reservation.status) && (
                                <div className="reservation-actions">
                                    <button
                                        className="cancel-button"
                                        onClick={() => handleCancelReservation(reservation.id)}
                                    >
                                        Cancel Reservation
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReservations;