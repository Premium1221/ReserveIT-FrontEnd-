import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import './ArrivalTimeDialog.css';
import PropTypes from "prop-types";

const ArrivalTimeDialog = ({ isOpen, onClose, onSubmit }) => {
    const [arrivalMinutes, setArrivalMinutes] = useState(15);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(arrivalMinutes);
    };

    return (
        <div className="dialog-overlay">
            <div className="dialog-container">
                <button
                    onClick={onClose}
                    className="close-button"
                >
                    <X size={20} />
                </button>

                <div className="dialog-header">
                    <h2 className="dialog-title">Quick Reservation</h2>
                    <p className="dialog-description">
                        How soon will you arrive at the restaurant?
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="form-label">
                            <Clock size={20} className="icon" />
                            <label>Arrival Time</label>
                        </div>

                        <input
                            type="range"
                            min="15"
                            max="60"
                            step="5"
                            value={arrivalMinutes}
                            onChange={(e) => setArrivalMinutes(Number(e.target.value))}
                            className="slider"
                        />

                        <div className="slider-value">
                            {arrivalMinutes} minutes
                        </div>
                    </div>

                    <div className="dialog-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="confirm-button"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ArrivalTimeDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ArrivalTimeDialog;