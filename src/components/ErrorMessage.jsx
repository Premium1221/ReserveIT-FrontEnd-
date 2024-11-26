import PropTypes from 'prop-types';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="error-container">
            <div className="error-content">
                <AlertCircle size={32} className="error-icon" />
                <p className="error-message">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="retry-button"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
    onRetry: PropTypes.func
};

export default ErrorMessage;