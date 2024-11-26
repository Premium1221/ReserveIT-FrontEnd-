import { useState } from 'react';
import PropTypes from 'prop-types';
import { Heart } from 'lucide-react';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant, onMakeReservation, onLike, initialLiked = false }) => {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [isAnimating, setIsAnimating] = useState(false);

    const {
        name,
        rating = 0,
        pictureUrl = '/default-restaurant.jpg',
        address,
        categories = []
    } = restaurant;

    const handleLike = async () => {
        setIsAnimating(true);
        setIsLiked(!isLiked);

        try {
            if (onLike) {
                await onLike(restaurant.id, !isLiked);
            }
        } catch (error) {
            // Revert the like state if the API call fails
            setIsLiked(isLiked);
            console.error('Failed to update like status:', error);
        }

        // Reset animation after 300ms
        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <div className="restaurant-card">
            <div className="restaurant-card-image">
                <img
                    src={pictureUrl}
                    alt={name}
                    className="card-image"
                />
                <button
                    className={`like-button ${isLiked ? 'liked' : ''} ${isAnimating ? 'animate' : ''}`}
                    onClick={handleLike}
                    aria-label={isLiked ? 'Unlike restaurant' : 'Like restaurant'}
                >
                    <Heart
                        className="heart-icon"
                        fill={isLiked ? "#ef4444" : "none"}
                        color={isLiked ? "#ef4444" : "#ffffff"}
                    />
                </button>
                {rating > 0 && (
                    <div className="rating">
                        <span>★ {rating.toFixed(1)}</span>
                    </div>
                )}
            </div>
            <div className="restaurant-info">
                <h3 className="restaurant-name">{name}</h3>
                {address && <p className="address">{address}</p>}
                {categories && categories.length > 0 && (
                    <div className="categories">
                        {categories.map((category, index) => (
                            <span key={index} className="tag">
                                {category.name}
                            </span>
                        ))}
                    </div>
                )}
                <button
                    className="reservation-button"
                    onClick={() => onMakeReservation(restaurant)}
                >
                    Make Reservation
                </button>
            </div>
        </div>
    );
};

RestaurantCard.propTypes = {
    restaurant: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        pictureUrl: PropTypes.string,
        rating: PropTypes.number,
        address: PropTypes.string,
        categories: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string
            })
        ),
    }).isRequired,
    onMakeReservation: PropTypes.func.isRequired,
    onLike: PropTypes.func,
    initialLiked: PropTypes.bool,
};

export default RestaurantCard;