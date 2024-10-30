import PropTypes from 'prop-types';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant, onMakeReservation }) => {
    return (
        <div className="restaurant-card">
            <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
            <div className="restaurant-details">
                <h2>{restaurant.name}</h2>
                <p>{restaurant.cuisine}</p>
                <p>Rating: {restaurant.rating}</p>
                <button className="reservation-button" onClick={onMakeReservation}>
                    Make a Reservation
                </button>
            </div>
        </div>
    );
};

RestaurantCard.propTypes = {
    restaurant: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        cuisine: PropTypes.string,
        rating: PropTypes.number,
        image: PropTypes.string,
    }).isRequired,
    onMakeReservation: PropTypes.func.isRequired,
};

export default RestaurantCard;
