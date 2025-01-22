import { Edit2, Trash2, Star } from 'lucide-react';
import PropTypes from 'prop-types';

const RestaurantList = ({ restaurants, onDelete, onEdit }) => {
    return (
        <div className="items-grid" data-testid="restaurants-grid">
            {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="item-card" data-testid="restaurant-card">
                    <div className="item-header">
                        <h3 data-testid="restaurant-name">{restaurant.name}</h3>
                        <span className="item-email" data-testid="restaurant-email">{restaurant.email}</span>
                    </div>

                    <div className="item-details">
                        <p data-testid="restaurant-address">Address: {restaurant.address || 'N/A'}</p>
                        <div className="rating" data-testid="restaurant-rating">
                            <Star size={16} className={restaurant.rating ? 'filled' : ''}/>
                            <span>{restaurant.rating ? `${restaurant.rating}/5` : 'No rating'}</span>
                        </div>
                    </div>

                    <div className="item-actions">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(restaurant.id)}
                                className="edit-button"
                                data-testid="edit-restaurant-button"
                            >
                                <Edit2 size={16}/>
                                Edit
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(restaurant.id)}
                            className="delete-button"
                            data-testid="delete-restaurant-button"
                        >
                            <Trash2 size={16}/>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

RestaurantList.propTypes = {
    restaurants: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string,
        address: PropTypes.string,
        rating: PropTypes.number
    })).isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func
};

export default RestaurantList;