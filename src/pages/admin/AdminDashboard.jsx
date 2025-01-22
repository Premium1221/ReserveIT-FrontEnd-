import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, UserPlus, Search, RefreshCcw, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/axiosConfig';
import { toast } from 'react-toastify';

import AddUserForm from './forms/AddUserForm';
import AddRestaurantForm from './forms/AddRestaurantForm';
import UserList from './lists/UserList';
import RestaurantList from './lists/RestaurantList';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import TabControl from './controls/TabControl';
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog.jsx";

import './AdminDashboard.css';
import ClearReservationsButton from "@/components/ClearReservationsButton.jsx";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [showAddRestaurantForm, setShowAddRestaurantForm] = useState(false);
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
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
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
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create user';
            toast.error(errorMessage);
        }
    };

    const handleAddRestaurant = async (restaurantData) => {
        try {
            const response = await api.post('/companies', restaurantData);

            if (response.data) {
                await fetchRestaurants();
                toast.success('Restaurant created successfully');
                setShowAddRestaurantForm(false);
            }
        } catch (error) {
            console.error('Create restaurant error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create restaurant';
            toast.error(errorMessage);
        }
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
                await api.delete(`admin/users/${itemId}`);
                setUsers(users.filter(user => user.id !== itemId));
                toast.success('User deleted successfully');
            } else {
                await api.delete(`companies/${itemId}`);
                setRestaurants(restaurants.filter(restaurant => restaurant.id !== itemId));
                toast.success('Restaurant deleted successfully');
            }
        } catch (error) {
            console.error('Delete error:', error);
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
            <div className="dashboard-header" data-testid="dashboard-header">
                <h1>Admin Dashboard</h1>
                <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    data-testid="search-input"
                />
                <TabControl
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={[
                        { id: 'users', label: 'Users', testId: 'tab-Users' },
                        { id: 'restaurants', label: 'Restaurants', testId: 'tab-Restaurants' }
                    ]}
                />

            </div>

            <div className="controls" data-testid="controls">
                <div className="search-bar">
                    <Search size={20}/>
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        data-testid="search-input"
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
                        data-testid="add-user-button"
                    >
                        <UserPlus size={20} />
                        Add User
                    </button>
                )}

                {activeTab === 'restaurants' && (
                    <button
                        className="add-button"
                        onClick={() => setShowAddRestaurantForm(true)}
                        data-testid="add-restaurant-button"
                    >
                        <PlusCircle size={20} />
                        Add Restaurant
                    </button>
                )}
            </div>

            <div className="dashboard-content">
                {activeTab === 'users' ? (
                    <UserList
                        users={getFilteredItems()}
                        onDelete={handleDeleteUser}
                        onEdit={() => {}}
                    />
                ) : (
                    <RestaurantList
                        restaurants={getFilteredItems()}
                        onDelete={handleDeleteRestaurant}
                        onEdit={() => {}}
                    />
                )}
            </div>

            {showAddUserForm && (
                <AddUserForm
                    onClose={() => setShowAddUserForm(false)}
                    onSubmit={handleAddUser}
                />
            )}

            {showAddRestaurantForm && (
                <AddRestaurantForm
                    onClose={() => setShowAddRestaurantForm(false)}
                    onSubmit={handleAddRestaurant}
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
