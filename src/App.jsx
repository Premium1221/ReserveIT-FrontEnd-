import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import RestaurantSlider from './components/RestaurantSlider';
import SliderHeader from './components/SliderHeader';
import Login from './pages/LoginForm.jsx';
import Register from './pages/RegisterForm.jsx';
import MyReservations from "./pages/MyReservations.jsx";
import ReservationModal from './components/ReservationModal'; // Import the modal component
import TableMapDemo from './pages/TableMapDemo';
import axios from 'axios';
import './App.css';

function App() {
    const [restaurants, setRestaurants] = useState([]);
    const [popularRestaurants, setPopularRestaurants] = useState([]);
    const [newRestaurants, setNewRestaurants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
    const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Selected restaurant for modal

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/companies'); // Update with your actual backend endpoint
                const data = await response.json();

                setRestaurants(data); // All restaurants
                setPopularRestaurants(data.slice(0, 3));
                setNewRestaurants(data.slice(3, 6)); // New restaurants (example logic)
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
            }
        };

        fetchRestaurants();
    }, []);

    // Open modal and set selected restaurant
    const handleOpenModal = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRestaurant(null);
    };

    // Handle reservation submission
    const handleReservationSubmit = (reservationData) => {
        axios.post('http://localhost:8080/api/reservations', {
            ...reservationData,
            companyId: selectedRestaurant.id
        })
            .then(() => {
                alert("Reservation made successfully!"); // Use alert to indicate success
                setIsModalOpen(false); // Close modal on success
            })
            .catch(() => {
                alert("Failed to make a reservation.");
            });
    };

    return (
        <Router>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <SliderHeader title="Today's offers" link="#see-all" />
                            <RestaurantSlider
                                restaurants={restaurants}
                                onMakeReservation={handleOpenModal} // Pass function to open modal
                            />

                            <SliderHeader title="Popular Restaurants" link="#see-all" />
                            <RestaurantSlider
                                restaurants={popularRestaurants}
                                onMakeReservation={handleOpenModal}
                            />

                            <SliderHeader title="New Arrivals" link="#see-all" />
                            <RestaurantSlider
                                restaurants={newRestaurants}
                                onMakeReservation={handleOpenModal}
                            />
                        </>
                    }
                />
                <Route path="/my-reservations" element={<MyReservations />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Add the route for the TableMapDemo page */}
                <Route path="/table-map-demo" element={<TableMapDemo />} />
            </Routes>

            {/* Render ReservationModal if a restaurant is selected */}
            {isModalOpen && selectedRestaurant && (
                <ReservationModal
                    restaurant={selectedRestaurant}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleReservationSubmit}
                />
            )}
        </Router>
    );
}

export default App;
