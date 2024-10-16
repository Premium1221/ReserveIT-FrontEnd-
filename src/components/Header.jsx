import  { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation
import Sidebar from './Sidebar';
import './Header.css';


const Header = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track if the user is logged in

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <header className="header">
            <div className="menu-logo">
                <button className="hamburger-menu" onClick={toggleSidebar}>
                    ☰
                </button>
                <div className="logo">
                    <h1>ReserveIT</h1>
                </div>
            </div>

            <div className="search-bar">
                <img src="src/assets/search-icon.png" alt="Search icon" className="search-icon" />
                <input type="text" placeholder="Search for restaurants..." />
            </div>

            <div className="account-controls">
                {isLoggedIn ? (
                    <button className="logout-button" onClick={() => setIsLoggedIn(false)}>Log Out</button>
                ) : (
                    <>

                        <Link to="/login" className="login-button">Log In</Link>
                        <Link to="/register" className="signup-button">Sign Up</Link>
                    </>
                )}
            </div>

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isLoggedIn={isLoggedIn} />
        </header>
    );
};

export default Header;
