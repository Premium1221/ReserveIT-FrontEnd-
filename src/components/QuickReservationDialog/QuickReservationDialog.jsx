import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Clock, Users } from 'lucide-react';
import './QuickReservationDialog.css';

const QuickReservationDialog = ({ isOpen, onClose, onSubmit, selectedTable }) => {
    const [reservationType, setReservationType] = useState('immediate');
    const [arrivalMinutes, setArrivalMinutes] = useState(15);
    const [partySize, setPartySize] = useState(2);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const reservationData = {
            tableId: selectedTable.id,
            partySize,
            immediate: reservationType === 'immediate',
            arrivalMinutes: parseInt(arrivalMinutes),
        };

        onSubmit(reservationData);
    };

    return (
        <div className="dialog-overlay" data-testid="quick-reservation-dialog">
            <div className="dialog-container">
                <h2 className="dialog-title" data-testid="dialog-title">Quick Reservation</h2>

                <form onSubmit={handleSubmit} className="form" data-testid="reservation-form">
                    {/* Party Size */}
                    <div className="form-group">
                        <label className="form-label">
                            <Users size={20} />
                            Party Size
                        </label>
                        <select
                            value={partySize}
                            onChange={(e) => setPartySize(parseInt(e.target.value))}
                            className="form-select"
                            data-testid="party-size-select"
                        >
                            {Array.from(
                                { length: selectedTable.capacity },
                                (_, i) => i + 1
                            ).map((num) => (
                                <option
                                    key={num}
                                    value={num}
                                    data-testid={`party-size-option-${num}`}
                                >
                                    {num} {num === 1 ? 'person' : 'people'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Reservation Type */}
                    <div className="form-group">
                        <label className="form-label">Arrival Time</label>
                        <div className="radio-group" data-testid="arrival-type-group">
                            <label className="radio-item">
                                <input
                                    type="radio"
                                    value="immediate"
                                    checked={reservationType === 'immediate'}
                                    onChange={(e) => setReservationType(e.target.value)}
                                    className="radio-input"
                                    data-testid="immediate-seating-radio"
                                />
                                Immediate Seating
                            </label>
                            <label className="radio-item">
                                <input
                                    type="radio"
                                    value="scheduled"
                                    checked={reservationType === 'scheduled'}
                                    onChange={(e) => setReservationType(e.target.value)}
                                    className="radio-input"
                                    data-testid="scheduled-seating-radio"
                                />
                                Schedule Arrival
                            </label>
                        </div>
                    </div>

                    {/* Arrival Time Selection */}
                    {reservationType === 'scheduled' && (
                        <div className="form-group" data-testid="arrival-time-group">
                            <label className="form-label">
                                <Clock size={20} />
                                Arrival in
                            </label>
                            <select
                                value={arrivalMinutes}
                                onChange={(e) => setArrivalMinutes(e.target.value)}
                                className="form-select"
                                data-testid="arrival-time-select"
                            >
                                <option value="15" data-testid="arrival-time-15">15 minutes</option>
                                <option value="30" data-testid="arrival-time-30">30 minutes</option>
                                <option value="45" data-testid="arrival-time-45">45 minutes</option>
                                <option value="60" data-testid="arrival-time-60">1 hour</option>
                            </select>
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="button button-cancel"
                            data-testid="cancel-reservation"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="button button-confirm"
                            data-testid="confirm-reservation"
                        >
                            Confirm Reservation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

QuickReservationDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    selectedTable: PropTypes.shape({
        id: PropTypes.string.isRequired,
        capacity: PropTypes.number.isRequired,
    }).isRequired,
};

export default QuickReservationDialog;