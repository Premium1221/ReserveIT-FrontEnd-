import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import RestaurantSlider from './components/RestaurantSlider';
import SliderHeader from './components/SliderHeader';
import Login from './pages/LoginForm.jsx';
import Register from './pages/RegisterForm.jsx';
import MyReservations from "./pages/MyReservations.jsx";
import './App.css';

function App() {
    const [restaurants, setRestaurants] = useState([]);
    const [popularRestaurants, setPopularRestaurants] = useState([]);
    const [newRestaurants, setNewRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                // Fetch restaurants from the backen API
                const response = await fetch('http://localhost:8080/api/companies'); // Update with your actual backend endpoint
                const data = await response.json();


                const allRestaurants = data;


                setRestaurants(allRestaurants); // All restaurants
                setPopularRestaurants(allRestaurants.slice(0, 3));
                setNewRestaurants(allRestaurants.slice(3, 6)); // New restaurants (example logic)
            } catch (error) {
                console.error("Failed to fetch restaurants:", error);
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <Router>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <SliderHeader title="Today's offers" link="#see-all" />
                            <RestaurantSlider restaurants={restaurants} />

                            <SliderHeader title="Popular Restaurants" link="#see-all" />
                            <RestaurantSlider restaurants={popularRestaurants} />

                            <SliderHeader title="New Arrivals" link="#see-all" />
                            <RestaurantSlider restaurants={newRestaurants} />
                        </>
                    }
                />
                <Route path="/my-reservations" element={<MyReservations />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
