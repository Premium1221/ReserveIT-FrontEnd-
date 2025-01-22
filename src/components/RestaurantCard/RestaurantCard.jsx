import { useState } from "react";
import { Heart, Map } from "lucide-react";
import PropTypes from "prop-types";
import {Link, useNavigate} from "react-router-dom";
import "./RestaurantCard.css";
import {useAuth} from "@/context/AuthContext.jsx";
import {toast} from "react-toastify"; // Ensure you import the CSS file

const RestaurantCard = ({ restaurant, onLike, initialLiked = false }) => {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    const handleLike = async () => {
        setIsLiked(!isLiked);
        if (onLike) {
            await onLike(restaurant.id, !isLiked);
        }
    };
    const handleViewTables = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to view table availability");
            navigate("/login", {
                state: {
                    returnUrl: `/restaurant/${restaurant.id}/tables`,
                    message: "Please log in to view table availability"
                }
            });
            return;
        }

        if (user?.role !== 'CUSTOMER') {
            toast.error("Only customers can view table availability");
            return;
        }

        navigate(`/restaurant/${restaurant.id}/tables`);
    };

    return (
        <div className="restaurant-card">
            <div className="restaurant-card-image">
                <img
                    src={restaurant.pictureUrl || "/default-restaurant.jpg"}
                    alt={restaurant.name}
                    className="card-image"
                />
                <button
                    className="like-button"
                    onClick={handleLike}
                    aria-label={isLiked ? "Unlike restaurant" : "Like restaurant"}
                >
                    <Heart
                        className="heart-icon"
                        fill={isLiked ? "#ef4444" : "none"}
                        color={isLiked ? "#ef4444" : "#ffffff"}
                    />
                </button>
                {restaurant.rating > 0 && (
                    <div className="rating">
                        <span>★ {restaurant.rating.toFixed(1)}</span>
                    </div>
                )}
            </div>

            <div className="restaurant-info">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                {restaurant.address && <p className="address">{restaurant.address}</p>}
                <div className="action-buttons">
                    <button
                        onClick={handleViewTables}
                        className="reservation-link"
                    >
                        View Live Map
                    </button>
                    <button
                        className="view-map-button"
                        title="View Live Map"
                        onClick={() => console.log("Navigating to map...")}
                    >
                        <Map size={20}/>
                    </button>
                </div>
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
    }).isRequired,
    onLike: PropTypes.func,
    initialLiked: PropTypes.bool,
};

export default RestaurantCard;
