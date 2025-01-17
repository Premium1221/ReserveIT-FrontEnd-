import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, UserPlus, Search, RefreshCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/axiosConfig';
import { toast } from 'react-toastify';

import AddUserForm from './forms/AddUserForm';
import UserList from './lists/UserList';
import RestaurantList from './lists/RestaurantList';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import TabControl from './controls/TabControl';
import ConfirmDialog from "../../components/ConfirmDialog";


import './AdminDashboard.css';
import ClearReservationsButton from "@/components/ClearReservationsButton.jsx";

const AdminDashboard = () => {
    // State management
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        itemId: null,
        itemType: null,
        message: ''
    });

    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Current user:', user);
        const checkAdminAccess = () => {
            if (!isAuthenticated || !user) {
                console.log('Not authenticated:', { isAuthenticated, user });
                toast.error('Please log in to access the admin dashboard');
                navigate('/login');
                return false;
            }

            console.log('Current user role:', user.role); // Debug log
            if (user.role !== 'ADMIN') {
                console.log('Access denied - not admin:', user.role);
                toast.error('Admin privileges required');
                navigate('/');
                return false;
            }

            return true;
        };

        if (checkAdminAccess()) {
            fetchInitialData();
        }
    }, [isAuthenticated, user, navigate]);

    // Fetch both users and restaurants data
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            setError(null);
            await Promise.all([fetchUsers(), fetchRestaurants()]);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load dashboard data');
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            console.log('Current user role:', user?.role); // Debug log
            const token = sessionStorage.getItem('accessToken');
            console.log('Using token:', token); // Debug log

            const response = await api.get('/admin/users');
            console.log('Users response:', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', {
                status: error.response?.status,
                data: error.response?.data,
                config: error.config,
                headers: error.response?.headers
            });
            if (error.response?.status === 403) {
                toast.error('Access denied: Insufficient permissions');
            } else {
                toast.error('Failed to fetch users');
            }
            throw error;
        }
    };

    const fetchRestaurants = async () => {
        try {
            const response = await api.get('/companies');
            setRestaurants(response.data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            throw error;
        }
    };

    const handleAddUser = async (userData) => {
        try {
            console.log('Sending user data:', userData);
            const requestData = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                role: userData.role.toUpperCase(),
                companyId: userData.companyId || null
            };

            if (requestData.role === 'MANAGER' && !requestData.companyId) {
                toast.error('Company assignment is required for managers');
                return;
            }
            const response = await api.post('/admin/users', requestData);

            if (response.data) {
                await fetchUsers();
                toast.success('User created successfully');
                setShowAddUserForm(false);
            }
        } catch (error) {
            console.error('Create user error:', error);
            const errorMessage = error.response?.data?.message
                || error.message
                || 'Failed to create user';
            toast.error(errorMessage);
        }
    };

    const handleEditUser = (userId) => {
        const userToEdit = users.find(user => user.id === userId);
        console.log('Editing user:', userToEdit);
        toast.info('Edit functionality coming soon!');
    };

    const handleEditRestaurant = (restaurantId) => {
        const restaurantToEdit = restaurants.find(restaurant => restaurant.id === restaurantId);
        console.log('Editing restaurant:', restaurantToEdit);
        toast.info('Edit functionality coming soon!');
    };

    const handleDeleteUser = (id) => {
        const userToDelete = users.find(user => user.id === id);
        setConfirmDialog({
            isOpen: true,
            itemId: id,
            itemType: 'user',
            message: `Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}?`
        });
    };

    const handleDeleteRestaurant = (id) => {
        const restaurantToDelete = restaurants.find(restaurant => restaurant.id === id);
        setConfirmDialog({
            isOpen: true,
            itemId: id,
            itemType: 'restaurant',
            message: `Are you sure you want to delete ${restaurantToDelete.name}?`
        });
    };

    const handleConfirmDelete = async () => {
        const { itemId, itemType } = confirmDialog;
        try {

            if (itemType === 'user') {
                await api.delete(`admin/users/${itemId.toString()}`);
                setUsers(users.filter(user => user.id !== itemId));
                toast.success('User deleted successfully');
            } else {
                await api.delete(`companies/${itemId}`);
                setRestaurants(restaurants.filter(restaurant => restaurant.id !== itemId));
                toast.success('Restaurant deleted successfully');
            }
        } catch (error) {
            console.error('Delete error:', error.response?.data || error.message);
            toast.error(error.response?.data || `Failed to delete ${itemType}`);
        } finally {
            setConfirmDialog({ isOpen: false, itemId: null, itemType: null, message: '' });
        }
    };

    const getFilteredItems = () => {
        const searchLower = searchTerm.toLowerCase();

        if (activeTab === 'users') {
            return users.filter(user =>
                user.email?.toLowerCase().includes(searchLower) ||
                user.firstName?.toLowerCase().includes(searchLower) ||
                user.lastName?.toLowerCase().includes(searchLower)
            );
        }

        return restaurants.filter(restaurant =>
            restaurant.name?.toLowerCase().includes(searchLower) ||
            restaurant.email?.toLowerCase().includes(searchLower)
        );
    };

    if (loading) return <LoadingSpinner message="Loading dashboard..." />;
    if (error) return <ErrorMessage message={error} onRetry={fetchInitialData} />;

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <TabControl
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={[
                        { id: 'users', label: 'Users' },
                        { id: 'restaurants', label: 'Restaurants' }
                    ]}
                />
            </div>

            <div className="controls">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchInitialData}
                >
                    <RefreshCcw size={20} />
                    Refresh
                </button>

                {activeTab === 'users' && (
                    <button
                        className="add-button"
                        onClick={() => setShowAddUserForm(true)}
                    >
                        <UserPlus size={20} />
                        Add User
                    </button>
                )}
            </div>

            <div className="dashboard-content">
                {activeTab === 'users' ? (
                    <UserList
                        users={getFilteredItems()}
                        onDelete={handleDeleteUser}
                        onEdit={handleEditUser}
                    />
                ) : (
                    <RestaurantList
                        restaurants={getFilteredItems()}
                        onDelete={handleDeleteRestaurant}
                        onEdit={handleEditRestaurant}
                    />
                )}
            </div>

            {showAddUserForm && (
                <AddUserForm
                    onClose={() => setShowAddUserForm(false)}
                    onSubmit={handleAddUser}
                    existingRestaurants={restaurants}
                />
            )}

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={`Delete ${confirmDialog.itemType === 'user' ? 'User' : 'Restaurant'}`}
                message={confirmDialog.message}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDialog({ isOpen: false, itemId: null, itemType: null, message: '' })}
            />
            <ClearReservationsButton />

        </div>
    );
};

export default AdminDashboard;