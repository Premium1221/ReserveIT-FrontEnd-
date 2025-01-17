import React, { useState, useEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import { useWebSocket } from '../hooks/useWebSocket';
import { toast } from 'react-toastify';
import api from '../config/axiosConfig';
import TableShape from '../components/TableShape.jsx';
import ReservationModal from '../components/ReservationModal';
import tableMap from '../assets/table-map.png';

const RestaurantMapView = ({ restaurantId }) => {
    const [tables, setTables] = useState([]);
    const [background, setBackground] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const { socket, connected } = useWebSocket();

    // Load background image
    useEffect(() => {
        const img = new window.Image();
        img.src = tableMap;
        img.onload = () => setBackground(img);
        img.onerror = () => toast.error('Failed to load restaurant map');
    }, []);

    // Fetch initial table data
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await api.get(`/tables/company/${restaurantId}`);
                setTables(response.data);
            } catch (error) {
                toast.error('Failed to load tables');
                console.error('Error fetching tables:', error);
            }
        };

        fetchTables();
    }, [restaurantId]);

    // WebSocket subscription for real-time updates
    useEffect(() => {
        if (!socket || !connected) {
            console.log('Socket not ready for subscription');
            return;
        }

        const topic = `/topic/tables/${restaurantId}`;
        console.log(`Subscribing to WebSocket topic: ${topic}`);

        const subscription = socket.subscribe(topic, (message) => {
            const updatedTable = JSON.parse(message.body);
            setTables((prevTables) =>
                prevTables.map((table) =>
                    table.id === updatedTable.id ? updatedTable : table
                )
            );
        });

        return () => {
            if (subscription) {
                console.log(`Unsubscribing from topic: ${topic}`);
                subscription.unsubscribe();
            }
        };
    }, [socket, connected, restaurantId]);

    const handleTableClick = (table) => {
        if (table.status !== 'AVAILABLE') {
            toast.info('This table is not available for reservation');
            return;
        }

        setSelectedTable(table);
        setShowReservationModal(true);
    };

    const handleReservationSubmit = async (reservationData) => {
        try {
            await api.post('/reservations', {
                ...reservationData,
                tableId: selectedTable.id,
                companyId: restaurantId,
            });
            toast.success('Reservation created successfully!');
            setShowReservationModal(false);
            setSelectedTable(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create reservation');
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Table Map</h2>
                <p className="text-gray-600">Click on an available table to make a reservation</p>
            </div>

            <div className="border rounded-lg bg-gray-50 p-4">
                <Stage width={800} height={600}>
                    <Layer>
                        {background && <Image image={background} width={800} height={600} />}
                        {tables.map((table) => (
                            <TableShape
                                key={table.id}
                                table={table}
                                onClick={() => handleTableClick(table)}
                                draggable={false}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>

            {showReservationModal && selectedTable && (
                <ReservationModal
                    table={selectedTable}
                    isOpen={showReservationModal}
                    onClose={() => {
                        setShowReservationModal(false);
                        setSelectedTable(null);
                    }}
                    onSubmit={handleReservationSubmit}
                />
            )}

            <div className="mt-4 flex gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span>Reserved</span>
                </div>
            </div>
        </div>
    );
};

export default RestaurantMapView;
