import { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import './ReservationModal.css';

const ReservationModal = ({ restaurant, isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        date: '',
        time: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        numberOfPeople: 2,
        specialRequests: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const availableTimeSlots = [
        '12:00', '13:00', '14:00', '17:00', '18:00', '19:00', '20:00'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const reservationDate = `${formData.date}T${formData.time}:00`;
            await onSubmit({
                ...formData,
                reservationDate,
                companyId: restaurant.id
            });
            setSubmitSuccess(true);
            setTimeout(() => {
                onClose();
                setSubmitSuccess(false);
                setStep(1);
                setFormData(initialFormData);
            }, 2000);
        } catch (error) {
            console.error('Reservation failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button
                    className="close-button"
                    onClick={onClose}
                    type="button"
                    aria-label="Close modal"
                >
                    <X size={24} />
                </button>

                {submitSuccess ? (
                    <div className="success-message">
                        <CheckCircle size={48} className="success-icon" />
                        <h3>Reservation Confirmed!</h3>
                        <p>We have sent you a confirmation email.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="modal-title">
                            Make a Reservation at {restaurant.name}
                        </h2>

                        <div className="reservation-progress">
                            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                                1. Date &amp; Time
                            </div>
                            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                                2. Details
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {step === 1 ? (
                                <div className="step-content">
                                    <div className="form-group">
                                        <label htmlFor="date">
                                            <Calendar size={16} />
                                            Date
                                        </label>
                                        <input
                                            id="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="time">
                                            <Clock size={16} />
                                            Time
                                        </label>
                                        <select
                                            id="time"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            required
                                        >
                                            <option value="">Select a time</option>
                                            {availableTimeSlots.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="numberOfPeople">
                                            <Users size={16} />
                                            Number of People
                                        </label>
                                        <input
                                            id="numberOfPeople"
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={formData.numberOfPeople}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                numberOfPeople: parseInt(e.target.value)
                                            })}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="next-button"
                                        onClick={() => setStep(2)}
                                        disabled={!formData.date || !formData.time}
                                    >
                                        Next
                                    </button>
                                </div>
                            ) : (
                                <div className="step-content">
                                    <div className="form-group">
                                        <label htmlFor="customerName">Full Name</label>
                                        <input
                                            id="customerName"
                                            type="text"
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                customerName: e.target.value
                                            })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="customerEmail">Email</label>
                                        <input
                                            id="customerEmail"
                                            type="email"
                                            value={formData.customerEmail}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                customerEmail: e.target.value
                                            })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="customerPhone">Phone</label>
                                        <input
                                            id="customerPhone"
                                            type="tel"
                                            value={formData.customerPhone}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                customerPhone: e.target.value
                                            })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="specialRequests">Special Requests</label>
                                        <textarea
                                            id="specialRequests"
                                            value={formData.specialRequests}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                specialRequests: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div className="button-group">
                                        <button
                                            type="button"
                                            className="back-button"
                                            onClick={() => setStep(1)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="submit-button"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

ReservationModal.propTypes = {
    restaurant: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ReservationModal;