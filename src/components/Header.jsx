// src/components/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import './Header.css';
import NotificationDropdown from "@/components/NotificationDropdown.jsx";


const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <header className={`header ${isSidebarOpen ? 'overlay-active' : ''}`}>
                <div className="menu-logo">
                    <button
                        className="hamburger-menu"
                        onClick={toggleSidebar}
                        style={{ pointerEvents: 'auto' }}
                    >
                        ☰
                    </button>
                    <Link to="/" className="logo">
                        <h1>ReserveIT</h1>
                    </Link>
                </div>

                <div className="search-bar">
                    <img src="src/assets/search-icon.png" alt="Search icon" className="search-icon" />
                    <input type="text" placeholder="Search for restaurants..." />
                </div>

                <div className="account-controls">
                    {isAuthenticated ? (
                        <>
                            {(user.role === 'STAFF' || user.role === 'MANAGER') && (
                                <NotificationDropdown
                                    restaurantId={user.companyId}
                                    onTableUpdate={() => {
                                    }} // You can handle global table updates here if needed
                                />
                            )}
                            <span>Welcome, {user.email}</span>
                            <span>Role: {user.role}</span>
                            <button className="logout-button" onClick={logout}>
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="login-button">Log In</Link>
                            <Link to="/register" className="signup-button">Sign Up</Link>
                        </>
                    )}
                </div>
            </header>

            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            {isSidebarOpen && (
                <div className="overlay" onClick={toggleSidebar}></div>
            )}
        </>
    );
};

export default Header;