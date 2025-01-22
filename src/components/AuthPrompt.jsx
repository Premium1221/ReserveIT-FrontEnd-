import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './AuthPrompt.css';
import React from 'react';

const AuthPrompt = ({ restaurantName }) => (
    <div className="auth-prompt-container">
        <h2 className="auth-prompt-title">
            Welcome to {restaurantName || 'our restaurant'}!
        </h2>
        <p className="auth-prompt-description">
            To make reservations and view table availability, please log in or create an account.
        </p>
        <div className="auth-prompt-actions">
            <Link to="/login" className="auth-button auth-login">
                Log In
            </Link>
            <Link to="/register" className="auth-button auth-register">
                Register
            </Link>
        </div>
    </div>
);

AuthPrompt.propTypes = {
    restaurantName: PropTypes.string,
};

AuthPrompt.defaultProps = {
    restaurantName: 'our restaurant',
};

export default AuthPrompt;
