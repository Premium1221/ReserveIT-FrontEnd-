import PropTypes from 'prop-types';
import './RestaurantCard.css';
import axios from 'axios';
import { useState } from 'react';
import ReservationModal from './ReservationModal'; // Import the modal

const RestaurantCard = ({ restaurant }) => {
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReservationClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleReservationSubmit = (reservationData) => {

        const dataWithCompanyId = {
            ...reservationData,
            companyId: restaurant.id
        };

        axios.post('http://localhost:8080/api/reservations', dataWithCompanyId)
            .then(() => {
                setMessage("Reservation made successfully!");
                setIsModalOpen(false); // Close modal on success
            })
            .catch(() => {
                setMessage("Failed to make a reservation.");
            });
    };

    return (
        <div className="restaurant-card">
            <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
            <div className="restaurant-details">
                <h2>{restaurant.name}</h2>
                <p>{restaurant.cuisine}</p>
                <p>Rating: {restaurant.rating}</p>
                <button className="reservation-button" onClick={handleReservationClick}>
                    Make a Reservation
                </button>
                {message && <p>{message}</p>} {/* Display reservation message */}
            </div>


            <ReservationModal
                restaurant={restaurant}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleReservationSubmit}
            />
        </div>
    );
};

RestaurantCard.propTypes = {
    restaurant: PropTypes.shape({
        name: PropTypes.string.isRequired,
        cuisine: PropTypes.string,
        rating: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        offer: PropTypes.string,
    }).isRequired,
};

export default RestaurantCard;
