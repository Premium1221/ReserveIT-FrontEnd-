import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Clock } from 'lucide-react';
import './Dashboard.css';

const StaffDashboard = () => {
    const [reservations, setReservations] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`/api/staff/reservations/${activeTab}`);
                setReservations(response.data);
            } catch (error) {
                console.error('Failed to fetch reservations:', error);
            }
        };

        fetchReservations();
    }, [activeTab]);

    const handleCheckIn = async (reservationId) => {
        try {
            await axios.post(`/api/reservations/${reservationId}/check-in`);
            // Refresh reservations
            const response = await axios.get(`/api/staff/reservations/${activeTab}`);
            setReservations(response.data);
        } catch (error) {
            console.error('Failed to check in:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Staff Dashboard</h1>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming
                </button>
                <button
                    className={`tab ${activeTab === 'checked-in' ? 'active' : ''}`}
                    onClick={() => setActiveTab('checked-in')}
                >
                    Checked In
                </button>
                <button
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed
                </button>
            </div>

            <div className="reservations-list">
                {reservations.map(reservation => (
                    <div key={reservation.id} className="reservation-card">
                        <div className="reservation-header">
                            <h3>{reservation.customerName}</h3>
                            <span className={`status ${reservation.status.toLowerCase()}`}>
                                {reservation.status}
                            </span>
                        </div>

                        <div className="reservation-details">
                            <p><Clock size={16} /> {new Date(reservation.reservationDate).toLocaleTimeString()}</p>
                            <p>Table {reservation.tableNumber}</p>
                            <p>{reservation.numberOfPeople} guests</p>
                        </div>

                        {activeTab === 'upcoming' && (
                            <div className="action-buttons">
                                <button
                                    className="check-in-button"
                                    onClick={() => handleCheckIn(reservation.id)}
                                >
                                    <Check size={16} />
                                    Check In
                                </button>
                                <button className="cancel-button">
                                    <X size={16} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffDashboard;