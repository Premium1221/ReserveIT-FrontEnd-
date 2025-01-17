import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InteractiveMap from "../components/InteractiveMap";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { toast } from "react-toastify";
import api from "../config/axiosConfig";

const CustomerReservationPage = () => {
    const { restaurantId } = useParams();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    useEffect(() => {
        const fetchRestaurantAndTables = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('Fetching restaurant with ID:', restaurantId);
                console.log('Current JWT token:', sessionStorage.getItem('accessToken'));

                const [restaurantResponse, tablesResponse] = await Promise.all([
                    api.get(`/companies/${restaurantId}`),
                    api.get(`/tables/restaurant/${restaurantId}/tables`)
                ]);

                console.log('Restaurant response:', restaurantResponse.data);
                console.log('Tables response:', tablesResponse.data);

                setRestaurant(restaurantResponse.data);
                setTables(tablesResponse.data);
            } catch (err) {
                console.error("Error details:", err.response || err);
                setError(err.response?.data?.message || "Failed to load restaurant and tables");
                toast.error(err.response?.data?.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantAndTables();
    }, [restaurantId]);

    if (loading) return <LoadingSpinner message="Loading tables..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-center mb-6">
                Live Map of {restaurant ? restaurant.name : 'Restaurant'}'s Tables
            </h1>
            <InteractiveMap
                tables={tables}
                modifiedTables={[]}
                onTablePositionUpdate={() => {}}
                onTableSelect={() => {}}
                mode="view"
            />
        </div>
    );
};

export default CustomerReservationPage;