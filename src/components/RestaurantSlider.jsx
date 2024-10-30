import PropTypes from 'prop-types';
import Slider from 'react-slick';
import RestaurantCard from './RestaurantCard';
import './RestaurantSlider.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import leftArrow from '../assets/left-arrow.png';
import rightArrow from '../assets/right-arrow.png';

// Arrow components for slider
const NextArrow = ({ className, onClick }) => {
    return (
        <div className={className} onClick={onClick}>
            <img src={rightArrow} alt="Next" className="arrow-img" />
        </div>
    );
};

const PrevArrow = ({ className, onClick }) => {
    return (
        <div className={className} onClick={onClick}>
            <img src={leftArrow} alt="Previous" className="arrow-img" />
        </div>
    );
};

// PropTypes for arrows
NextArrow.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

PrevArrow.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

const RestaurantSlider = ({ restaurants, onMakeReservation }) => {
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="restaurant-slider">
            {restaurants.length > 0 ? (
                <Slider {...sliderSettings}>
                    {restaurants.map((restaurant, index) => (
                        <RestaurantCard
                            key={index}
                            restaurant={restaurant}
                            onMakeReservation={() => onMakeReservation(restaurant)} // Pass down function with restaurant info
                        />
                    ))}
                </Slider>
            ) : (
                <p>No restaurants available</p>
            )}
        </div>
    );
};

// PropTypes for RestaurantSlider
RestaurantSlider.propTypes = {
    restaurants: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired, // Ensure ID is passed for reservation
            name: PropTypes.string.isRequired,
            address: PropTypes.string,
            phone: PropTypes.string,
            email: PropTypes.string,
            rating: PropTypes.number,
            tags: PropTypes.arrayOf(PropTypes.string),
            pictureUrl: PropTypes.string,
        })
    ).isRequired,
    onMakeReservation: PropTypes.func.isRequired, // Add prop type for the callback
};

export default RestaurantSlider;
