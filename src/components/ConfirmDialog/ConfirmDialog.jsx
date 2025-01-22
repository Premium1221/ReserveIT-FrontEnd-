import { AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel, title = 'Confirm Action' }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-dialog-overlay" data-testid="confirm-dialog-overlay">
            <div className="confirm-dialog" data-testid="confirm-dialog">
                <div className="confirm-dialog-header">
                    <AlertTriangle size={24} className="warning-icon" />
                    <h2 data-testid="confirm-dialog-title">{title}</h2>
                </div>

                <div className="confirm-dialog-content">
                    <p data-testid="confirm-dialog-message">{message}</p>
                </div>

                <div className="confirm-dialog-actions">
                    <button
                        className="cancel-button"
                        onClick={onCancel}
                        data-testid="confirm-dialog-cancel-button"
                    >
                        Cancel
                    </button>
                    <button
                        className="confirm-button"
                        onClick={onConfirm}
                        data-testid="confirm-dialog-confirm-button"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    title: PropTypes.string,
};

export default ConfirmDialog;
