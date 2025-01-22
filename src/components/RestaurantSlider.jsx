import PropTypes from 'prop-types';
import Slider from 'react-slick';
import RestaurantCard from './RestaurantCard/RestaurantCard.jsx';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './RestaurantSlider.css';

const PrevArrow = ({ onClick }) => (
    <div className="slider-arrow prev" onClick={onClick}>
        <img src="src/assets/left-arrow.png" alt="Previous" />
    </div>
);

const NextArrow = ({ onClick }) => (
    <div className="slider-arrow next" onClick={onClick}>
        <img src="src/assets/right-arrow.png" alt="Next" />
    </div>
);

const RestaurantSlider = ({ restaurants, onMakeReservation }) => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <div className="restaurant-slider">
            <Slider {...settings}>
                {restaurants.map((restaurant, index) => (
                    <RestaurantCard
                        key={index}
                        restaurant={restaurant}
                        onMakeReservation={onMakeReservation}
                    />
                ))}
            </Slider>
        </div>
    );
};

RestaurantSlider.propTypes = {
    restaurants: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        address: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
        categories: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string
        })),
        rating: PropTypes.number,
        pictureUrl: PropTypes.string
    })).isRequired,
    onMakeReservation: PropTypes.func.isRequired
};

export default RestaurantSlider;