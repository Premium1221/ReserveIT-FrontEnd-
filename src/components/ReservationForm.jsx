import  { useState } from 'react';
import axios from 'axios';

const ReservationForm = ({ restaurantName, handleClose }) => {
    const [customerName, setCustomerName] = useState('');
    const [reservationDate, setReservationDate] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const reservation = {
            customerName: customerName,
            reservationDate: reservationDate,
            numberOfPeople: numberOfPeople,
            restaurantName: restaurantName  // Capture the restaurant's name
        };

        axios.post('http://localhost:8080/api/reservations', reservation)
            .then(response => {
                setMessage('Reservation created successfully!');
                handleClose();  // Close the modal after reservation is made
            })
            .catch(error => {
                setMessage('Failed to make a reservation.');
            });
    };

    return (
        <div>
            <h2>Make a Reservation for {restaurantName}</h2>
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
                <button type="submit">Make Reservation</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ReservationForm;
