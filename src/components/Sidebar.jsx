import React from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
import {Link} from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar, isLoggedIn }) => {
    return (
        <>
            {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                {isLoggedIn ? (
                    <>
                        <a href="#orders">Orders</a>
                        <a href="#favorites">Favorites</a>
                        <a href="#wallet">Wallet</a>
                        <a href="#meal-plan">Meal Plan</a>
                        <a href="#help">Help</a>
                        <a href="#promotions">Promotions</a>
                        <a href="#invite">Invite Friends</a>
                        <a href="#sign-out">Sign Out</a>
                    </>
                ) : (
                    <>
                        <Link to="/my-reservations" onClick={toggleSidebar}>My Reservations</Link>
                        <button className="signup-btn">Sign up</button>
                        <button className="login-btn">Log in</button>
                        <a href="#create-business">Create a business account</a>
                        <a href="#add-restaurant">Add your restaurant</a>
                        <a href="#sign-up-deliver">Sign up to deliver</a>
                    </>
                )}
                <button className="close-btn" onClick={toggleSidebar}>Close</button>
            </div>
        </>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
};

export default Sidebar;
