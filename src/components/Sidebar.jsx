// src/components/Sidebar.jsx
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = () => {
        logout();
        toggleSidebar();
        navigate('/login');
    };

    const renderAuthenticatedMenu = () => {
        if (!user) return null;

        const menuItems = [];

        menuItems.push(
            <Link
                key="home"
                to="/"
                onClick={toggleSidebar}
            >
                Home
            </Link>
        );

        // Role-specific items
        switch (user.role) {
            case 'ADMIN':
                menuItems.push(
                    <Link key="admin" to="/admin-dashboard" onClick={toggleSidebar}>
                        Admin Dashboard
                    </Link>,
                    <Link key="restaurants" to="/restaurant-dashboard" onClick={toggleSidebar}>
                        Restaurant Management
                    </Link>,
                    <Link key="reservations" to="/my-reservations" onClick={toggleSidebar}>
                        Reservations
                    </Link>
                );
                break;

            case 'MANAGER':
                menuItems.push(
                    <Link key="manager" to="/restaurant-dashboard" onClick={toggleSidebar}>
                        Restaurant Dashboard
                    </Link>,
                    <Link key="tables" to="/table-map-demo" onClick={toggleSidebar}>
                        Table Management
                    </Link>
                );
                break;

            case 'CUSTOMER':
                menuItems.push(
                    <Link key="reservations" to="/my-reservations" onClick={toggleSidebar}>
                        My Reservations
                    </Link>
                );
                break;

            case 'STAFF':
                menuItems.push(
                    <Link key="staff" to="/staff-dashboard" onClick={toggleSidebar}>
                        Staff Dashboard
                    </Link>
                );
                break;

            default:
                break;
        }

        return menuItems;
    };

    return (
        <>
            {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                {isAuthenticated ? (
                    <>
                        <div className="user-info">
                            <span>{user?.email}</span>
                            <span className="user-role">{user?.role}</span>
                        </div>

                        {renderAuthenticatedMenu()}

                        <button onClick={handleLogout}>
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/" onClick={toggleSidebar}>Home</Link>
                        <Link to="/login" onClick={toggleSidebar}>Log In</Link>
                        <Link to="/register" onClick={toggleSidebar}>Register</Link>
                    </>
                )}

                <button className="close-btn" onClick={toggleSidebar}>
                    ×
                </button>
            </div>
        </>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;