import { useState, useEffect } from 'react';
import axios from 'axios';
import './MyReservations.css';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/reservations')
            .then(response => {
                setReservations(response.data);
            })
            .catch(error => {
                console.error('Error fetching reservations', error);
            });
    }, []);

    return (
        <div className="my-reservations">
            <h2>My Reservations</h2>
            <ul>
                {reservations.map((reservation, index) => (
                    <li key={index}>
                        {reservation.customerName} -
                        {reservation.company ? reservation.company.name : 'Unknown Company'} -
                        {reservation.numberOfPeople} people on {reservation.reservationDate}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyReservations;
