import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import api from '../config/axiosConfig';
import './Dashboard.css';

const RestaurantDashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        companyName: '',
        stats: {
            totalReservations: 0,
            availableTables: 0,
            occupiedTables: 0,
            totalTables: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.companyId) {
                setError('No company ID found');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                console.log('Fetching dashboard for company:', user.companyId);
                console.log('User token:', sessionStorage.getItem('accessToken'));

                const response = await api.get(`/companies/${user.companyId}/dashboard`);
                console.log('Dashboard response:', response.data);

                if (!response.data || !response.data.company) {
                    throw new Error('Invalid response format');
                }

                setDashboardData({
                    companyName: response.data.company.name,
                    stats: {
                        totalReservations: response.data.stats.totalReservations || 0,
                        availableTables: response.data.stats.availableTables || 0,
                        occupiedTables: response.data.stats.occupiedTables || 0,
                        totalTables: response.data.stats.totalTables || 0
                    }
                });
            } catch (err) {
                console.error('Dashboard error:', err);
                setError(err.response?.data || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (loading) return <LoadingSpinner message="Loading dashboard..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="dashboard-container">
            <div className="flex justify-between items-center mb-6">
                <h1>{dashboardData.companyName} Dashboard</h1>
                {user?.companyId && (
                    <Link
                        to="/table-management"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Settings size={20} />
                        Manage Tables
                    </Link>
                )}
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <Calendar size={24} />
                    <h3>Today's Reservations</h3>
                    <p>{dashboardData.stats.totalReservations}</p>
                </div>
                <div className="stat-card">
                    <Clock size={24} />
                    <h3>Available Tables</h3>
                    <p>{dashboardData.stats.availableTables}</p>
                </div>
                <div className="stat-card">
                    <Users size={24} />
                    <h3>Occupied Tables</h3>
                    <p>{dashboardData.stats.occupiedTables}</p>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDashboard;