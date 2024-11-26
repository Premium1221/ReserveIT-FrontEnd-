import PropTypes from 'prop-types';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-message">{message}</p>
        </div>
    );
};

LoadingSpinner.propTypes = {
    message: PropTypes.string
};

export default LoadingSpinner;