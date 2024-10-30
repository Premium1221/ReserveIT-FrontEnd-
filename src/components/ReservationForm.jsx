import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';

const ReservationForm = ({ companyId, handleClose }) => {
    const [customerName, setCustomerName] = useState('');
    const [reservationDate, setReservationDate] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const reservation = {
            customerName,
            reservationDate,
            numberOfPeople,
            companyId,
        };

        axios.post('/api/reservations', reservation)
            .then(() => {
                setMessage('Reservation created successfully!');
                setTimeout(() => {
                    setMessage('');
                    handleClose();
                }, 1500);  // Close modal after a brief success message
            })
            .catch(() => {
                setMessage('Failed to make a reservation.');
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
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
                required
                min="1"
            />
            <button type="submit">Confirm Reservation</button>
            {message && <p>{message}</p>}
        </form>
    );
};

ReservationForm.propTypes = {
    companyId: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default ReservationForm;
