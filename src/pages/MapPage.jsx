import { useParams } from 'react-router-dom';
import InteractiveMap from "@/components/InteractiveMap.jsx";


const MapPage = () => {
    const { restaurantId } = useParams();

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Restaurant Map</h1>
            <InteractiveMap restaurantId={restaurantId} mode="view" />
        </div>
    );
};

export default MapPage;
