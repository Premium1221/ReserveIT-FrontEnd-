import PropTypes from 'prop-types';
import Slider from 'react-slick';
import RestaurantCard from './RestaurantCard';
import './RestaurantSlider.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import leftArrow from '../assets/left-arrow.png';
import rightArrow from '../assets/right-arrow.png';

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

// Ensure onClick is passed by react-slick
NextArrow.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

PrevArrow.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

const RestaurantSlider = ({ restaurants }) => {
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,  // Just provide the component, react-slick handles onClick
        prevArrow: <PrevArrow />,  // Just provide the component, react-slick handles onClick
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
                        <RestaurantCard key={index} restaurant={restaurant} />
                    ))}
                </Slider>
            ) : (
                <p>No restaurants available</p>
            )}
        </div>
    );
};

RestaurantSlider.propTypes = {
    restaurants: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            cuisine: PropTypes.string.isRequired,
            rating: PropTypes.number.isRequired,
            image: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
            offer: PropTypes.string,
        })
    ).isRequired,
};

export default RestaurantSlider;
