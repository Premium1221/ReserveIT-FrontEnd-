import { useState, useEffect } from 'react';
import { AlertCircle, UserPlus, Search, RefreshCcw } from 'lucide-react';
import api from '../config/axiosConfig.jsx';
import './AdminDashboard.css';
import AddUserForm from "../components/AddUserForm.jsx";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [showAddUserForm, setShowAddUserForm] = useState(false);

    const handleAddUser = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            await fetchItems();
            return response.data;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    };
    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/${activeTab === 'users' ? 'users' : 'companies'}`);
            setItems(response.data);
            setError(null);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(`Failed to load ${activeTab}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await api.delete(`/${activeTab === 'users' ? 'users' : 'companies'}/${id}`);
            setItems(items.filter(item => item.id !== id));
            alert('Item deleted successfully');
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete item');
        }
    };

    const handleEdit = (id) => {
        // To be implemented
        console.log('Edit item:', id);
    };

    const handleAddNew = () => {
        if (activeTab === 'users') {
            setShowAddUserForm(true);
        } else {
            // Handle adding new restaurant
            console.log('Add new restaurant');
        }
    };

    const filteredItems = items.filter(item => {
        const searchStr = searchTerm.toLowerCase();
        if (activeTab === 'users') {
            return (
                item.email?.toLowerCase().includes(searchStr) ||
                item.firstName?.toLowerCase().includes(searchStr) ||
                item.lastName?.toLowerCase().includes(searchStr)
            );
        } else {
            return (
                item.name?.toLowerCase().includes(searchStr) ||
                item.email?.toLowerCase().includes(searchStr)
            );
        }
    });

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                Loading...
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>

                <div className="tab-controls">
                    <button
                        className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'companies' ? 'active' : ''}`}
                        onClick={() => setActiveTab('companies')}
                    >
                        Restaurants
                    </button>
                </div>
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

                <button className="refresh-button" onClick={fetchItems}>
                    <RefreshCcw size={20} />
                    Refresh
                </button>

                <button className="add-button" onClick={handleAddNew}>
                    <UserPlus size={20} />
                    Add {activeTab === 'users' ? 'User' : 'Restaurant'}
                </button>
            </div>

            {error ? (
                <div className="error">
                    <AlertCircle size={20} />
                    {error}
                </div>
            ) : (
                <div className="items-grid">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="item-card">
                            <div className="item-header">
                                <h3>{activeTab === 'users' ? `${item.firstName} ${item.lastName}` : item.name}</h3>
                                <span className="item-email">{item.email}</span>
                            </div>

                            <div className="item-details">
                                {activeTab === 'users' ? (
                                    <>
                                        <p>Role: {item.role || 'User'}</p>
                                        <p>Phone: {item.phoneNumber || 'N/A'}</p>
                                    </>
                                ) : (
                                    <>
                                        <p>Address: {item.address || 'N/A'}</p>
                                        <p>Rating: {item.rating ? `${item.rating}/5` : 'No rating'}</p>
                                    </>
                                )}
                            </div>

                            <div className="item-actions">
                                <button onClick={() => handleEdit(item.id)} className="edit-button">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="delete-button">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showAddUserForm && (
                <AddUserForm
                    onClose={() => setShowAddUserForm(false)}
                    onSubmit={handleAddUser}
                />
            )}
        </div>
    );
};

export default AdminDashboard;