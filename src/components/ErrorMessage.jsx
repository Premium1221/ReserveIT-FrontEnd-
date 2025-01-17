import PropTypes from 'prop-types';
import { AlertCircle } from 'lucide-react';
import './ErrorMessage.css';

const ErrorDisplay = ({ message, onRetry }) => {
    return (
        <div className="error-container">
            <div className="error-content">
                <AlertCircle className="error-icon" />
                <p className="error-message">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="retry-button"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

ErrorDisplay.propTypes = {
    message: PropTypes.string.isRequired,
    onRetry: PropTypes.func,
};

ErrorDisplay.defaultProps = {
    onRetry: null,
};

export default ErrorDisplay;
