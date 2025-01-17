import React, { useState } from 'react';
import { Calendar, Clock, Users, MessageSquare } from 'lucide-react';
import PropTypes from "prop-types";
import './ReservationModal.css';

const ReservationModal = ({ restaurant, isOpen, onClose, onSubmit, selectedTable }) => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        numberOfPeople: selectedTable?.capacity || 2,
        specialRequests: ''
    });

    const [currentStep, setCurrentStep] = useState(1);

    const timeSlots = [];
    for (let hour = 11; hour <= 22; hour++) {
        timeSlots.push(`${String(hour).padStart(2, '0')}:00`);
        timeSlots.push(`${String(hour).padStart(2, '0')}:30`);
    }

    const handleFinalSubmit = (e) => {
        e.preventDefault();
        const reservationDate = `${formData.date}T${formData.time}:00`;
        onSubmit({
            ...formData,
            reservationDate,
            tableId: selectedTable?.id,
            companyId: restaurant.id
        });
        onClose();
    };

    const handleNextStep = (e) => {
        e.preventDefault(); // Prevent form submission
        setCurrentStep(2);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-header">
                    Book a Table at {restaurant?.name}
                </h2>

                {selectedTable && (
                    <div className="selected-table-info">
                        <p>Table {selectedTable.tableNumber} · {selectedTable.capacity} seats</p>
                    </div>
                )}

                <div className="progress-bar">
                    <div className={`progress-step ${currentStep === 1 ? 'active' : ''}`} />
                    <div className={`progress-step ${currentStep === 2 ? 'active' : ''}`} />
                </div>

                {currentStep === 1 ? (
                    <form onSubmit={handleNextStep} className="form-section">
                        <div className="form-group">
                            <label className="form-label">
                                <Calendar className="icon" /> Select Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Clock className="icon" /> Select Time
                            </label>
                            <select
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="form-select"
                                required
                            >
                                <option value="">Choose time</option>
                                {timeSlots.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Users className="icon" /> Number of People
                            </label>
                            <select
                                value={formData.numberOfPeople}
                                onChange={(e) => setFormData({ ...formData, numberOfPeople: Number(e.target.value) })}
                                className="form-select"
                                required
                            >
                                {Array.from({ length: selectedTable?.capacity || 10 }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num}>
                                        {num} {num === 1 ? 'person' : 'people'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                onClick={onClose}
                                className="button button-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="button button-primary"
                            >
                                Next
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleFinalSubmit} className="form-section">
                        <div className="form-group">
                            <label className="form-label">
                                <MessageSquare className="icon" /> Special Requests
                            </label>
                            <textarea
                                value={formData.specialRequests}
                                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                placeholder="Any special requirements or preferences?"
                                className="form-textarea textarea-large"
                            />
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className="button button-cancel"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="button button-primary"
                            >
                                Confirm Reservation
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

ReservationModal.propTypes = {
    restaurant: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
    }),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    selectedTable: PropTypes.shape({
        id: PropTypes.number,
        tableNumber: PropTypes.string,
        capacity: PropTypes.number,
    }),
};

ReservationModal.defaultProps = {
    restaurant: {
        id: '',
        name: 'Unknown',
    },
};

export default ReservationModal;
