import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Users, Settings } from 'lucide-react';
import './Dashboard.css';

const RestaurantDashboard = () => {
    const [restaurantData, setRestaurantData] = useState({
        todayReservations: [],
        tables: [],
        stats: {
            totalReservations: 0,
            availableTables: 0,
            occupiedTables: 0
        }
    });

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await axios.get('/api/restaurant/dashboard');
                setRestaurantData(response.data);
            } catch (error) {
                console.error('Failed to fetch restaurant data:', error);
            }
        };

        fetchRestaurantData();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Restaurant Manager Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <Calendar size={24} />
                    <h3>Today's Reservations</h3>
                    <p>{restaurantData.stats.totalReservations}</p>
                </div>

                <div className="stat-card">
                    <Clock size={24} />
                    <h3>Available Tables</h3>
                    <p>{restaurantData.stats.availableTables}</p>
                </div>

                <div className="stat-card">
                    <Users size={24} />
                    <h3>Occupied Tables</h3>
                    <p>{restaurantData.stats.occupiedTables}</p>
                </div>
            </div>

            <div className="action-buttons">
                <button className="action-button">
                    <Settings size={20} />
                    Manage Restaurant
                </button>
            </div>

            <div className="upcoming-reservations">
                <h2>Today's Reservations</h2>
                {restaurantData.todayReservations.map(reservation => (
                    <div key={reservation.id} className="reservation-card">
                        <p><strong>Time:</strong> {reservation.time}</p>
                        <p><strong>Guests:</strong> {reservation.numberOfPeople}</p>
                        <p><strong>Table:</strong> {reservation.tableNumber}</p>
                        <p><strong>Customer:</strong> {reservation.customerName}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantDashboard;