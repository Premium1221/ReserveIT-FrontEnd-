import React from 'react';
import PropTypes from 'prop-types';
import './ReservationModal.css';

const ReservationModal = ({ restaurant, isOpen, onClose, onSubmit }) => {
    const [customerName, setCustomerName] = React.useState('');
    const [reservationDate, setReservationDate] = React.useState('');
    const [numberOfPeople, setNumberOfPeople] = React.useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        const reservation = {
            restaurant: restaurant.name,
            customerName,
            reservationDate,
            numberOfPeople,
        };
        onSubmit(reservation);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Make a Reservation at {restaurant.name}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your Name"
                        required
                    />
                    <input
                        type="date"
                        value={reservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        value={numberOfPeople}
                        onChange={(e) => setNumberOfPeople(e.target.value)}
                        placeholder="Number of People"
                        min="1"
                        required
                    />
                    <button type="submit">Confirm Reservation</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

ReservationModal.propTypes = {
    restaurant: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default ReservationModal;
