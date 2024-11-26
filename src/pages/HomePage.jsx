import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../config/axiosConfig.jsx';

// Components
import RestaurantSlider from '../components/RestaurantSlider';
import SliderHeader from '../components/SliderHeader';
import ReservationModal from '../components/ReservationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Custom hooks
const useRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get('/companies');

            const processedData = data.map(restaurant => ({
                ...restaurant,
                pictureUrl: restaurant.pictureUrl || '/res-image.jpg',
                rating: restaurant.rating || 0
            }));

            setRestaurants(processedData);
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                "Unable to load restaurants. Please try again later.";
            setError(errorMessage);
            console.error('Error fetching restaurants:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    return { restaurants, loading, error, refetch: fetchRestaurants };
};

const useModalState = () => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        selectedRestaurant: null
    });

    const handleModalOpen = (restaurant) => {
        setModalState({
            isOpen: true,
            selectedRestaurant: restaurant
        });
    };

    const handleModalClose = () => {
        setModalState({
            isOpen: false,
            selectedRestaurant: null
        });
    };

    return {
        modalState,
        handleModalOpen,
        handleModalClose
    };
};

function HomePage() {
    const { restaurants, loading, error, refetch } = useRestaurants();
    const { modalState, handleModalOpen, handleModalClose } = useModalState();

    const handleReservationSubmit = async (reservationData) => {
        try {
            await api.post('/reservations', reservationData);
            toast.success('Reservation created successfully!');
            handleModalClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create reservation');
        }
    };

    const getRestaurantLists = () => {
        try {
            return {
                popular: [...restaurants]
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .slice(0, 5),
                new: [...restaurants]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5),
                special: [...restaurants].slice(0, 5)
            };
        } catch (error) {
            console.error('Error processing restaurant lists:', error);
            return {
                popular: [],
                new: [],
                special: []
            };
        }
    };

    const renderRestaurantSection = (title, restaurantsList, link) => {
        if (!Array.isArray(restaurantsList) || restaurantsList.length === 0) {
            return null;
        }

        return (
            <section className="restaurant-section">
                <SliderHeader title={title} link={link} />
                <RestaurantSlider
                    restaurants={restaurantsList}
                    onMakeReservation={handleModalOpen}
                />
            </section>
        );
    };

    if (loading) return <LoadingSpinner message="Loading restaurants..." />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;

    const lists = getRestaurantLists();

    return (
        <>
            <div className="home-container">
                {renderRestaurantSection("Featured Restaurants", lists.special, "/restaurants/special")}
                {renderRestaurantSection("Popular Restaurants", lists.popular, "/restaurants/popular")}
                {renderRestaurantSection("New Arrivals", lists.new, "/restaurants/all")}
            </div>

            <ReservationModal
                restaurant={modalState.selectedRestaurant}
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                onSubmit={handleReservationSubmit}
            />
        </>
    );
}

export default HomePage;