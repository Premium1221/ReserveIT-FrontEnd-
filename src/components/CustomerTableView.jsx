import React, { useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../config/axiosConfig';
import { connectWebSocket } from '../config/websocketConfig';
import { useAuth } from "@/context/AuthContext";
import AuthPrompt from './AuthPrompt';
import TableShape from './TableShape';
import TableHoverInfo from './TableHoverInfo';
import QuickReservationDialog from "./QuickReservationDialog/QuickReservationDialog.jsx";
import ReservationModal from "@/components/ReservationModal.jsx";
import './CustomerTableView.css';

const CustomerTableView = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const { isAuthenticated, user } = useAuth();
    const { restaurantId } = useParams();

    const [state, setState] = useState({
        loading: true,
        tables: [],
        restaurant: null,
        background: null,
        selectedTable: null,
        hoveredTable: null,
        showReservationModal: false,
    });

    const updateState = useCallback((updates) => {
        setState(prev => ({ ...prev, ...(typeof updates === 'function' ? updates(prev) : updates) }));
    }, []);

    const fetchTableData = useCallback(async () => {
        try {
            const response = await api.get(`/tables/restaurant/${restaurantId}/tables`);
            updateState({ tables: response.data });
        } catch (error) {
            console.error('Error fetching table data:', error);
            toast.error('Failed to refresh table data');
        }
    }, [restaurantId, updateState]);

    const handleTableUpdate = useCallback((updatedTable) => {
        updateState(prevState => ({
            tables: prevState.tables.map(table =>
                table.id === updatedTable.id ? { ...table, ...updatedTable } : table
            ),
            selectedTable: prevState.selectedTable?.id === updatedTable.id
                ? { ...prevState.selectedTable, ...updatedTable }
                : prevState.selectedTable,
        }));
    }, [updateState]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated && user?.email) {
                try {
                    const response = await api.get(`/users/byEmail/${encodeURIComponent(user.email)}`);
                    setUserData(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    toast.error('Failed to load user data');
                }
            }
        };

        fetchUserData();
    }, [isAuthenticated, user]);

    useEffect(() => {
        const cleanup = connectWebSocket(
            restaurantId,
            handleTableUpdate,
            notification => {
                if (notification.type === 'TABLE_STATUS_CHANGED') {
                    fetchTableData();
                }
            }
        );

        return () => cleanup?.();
    }, [restaurantId, handleTableUpdate, fetchTableData]);

    useEffect(() => {
        const img = new window.Image();
        img.src = '/src/assets/table-map.png';
        img.onload = () => updateState({ background: img });
        img.onerror = () => toast.error('Failed to load background image');
    }, [updateState]);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!isAuthenticated) {
                updateState({ loading: false });
                return;
            }

            try {
                const [restaurantResponse] = await Promise.all([
                    api.get(`/companies/${restaurantId}`),
                    fetchTableData()
                ]);

                updateState({
                    restaurant: restaurantResponse.data,
                    loading: false,
                });
            } catch (error) {
                console.error('Error loading initial data:', error);
                toast.error('Failed to load restaurant data');
                updateState({ loading: false });
            }
        };

        fetchInitialData();
    }, [restaurantId, isAuthenticated, fetchTableData, updateState]);

    const handleFutureReservation = async (reservationData) => {
        try {
            const response = await api.post('/reservations', {
                ...reservationData,
                companyId: restaurantId,
                userId: user.id,
                specialRequests: reservationData.specialRequests || '',
                status: 'CONFIRMED'
            });

            if (response.data) {
                toast.success('Reservation created successfully!');
                updateState({ showReservationModal: false });
                await fetchTableData();
            }
        } catch (error) {
            console.error('Future reservation error:', error);
            if (error.response?.data?.message === "Restaurant is closed at this time") {
                toast.error('Restaurant is closed at the selected time. Operating hours are 6 AM - 11:59 PM');
            } else {
                toast.error(error.response?.data?.message || 'Failed to create reservation');
            }
        }
    };

    const handleQuickReservation = async (reservationData) => {
        try {
            const now = new Date();
            let reservationDate;

            if (reservationData.immediate) {
                reservationDate = Date.now()
            } else {
                const arrivalTime = new Date(now.getTime() + (reservationData.arrivalMinutes * 60000));
                reservationDate = arrivalTime.toISOString().slice(0, 19);
            }

            const reservationRequest = {
                companyId: state.restaurant.id,
                tableId: state.selectedTable.id,
                userId: user.id,
                numberOfPeople: reservationData.partySize,
                reservationDate: reservationDate,
                duration: 180,
                specialRequests: '',
                status: 'CONFIRMED',
            };

            const response = await api.post('/reservations/quick', reservationRequest, {
                params: { immediate: reservationData.immediate },
            });

            if (response.data) {
                toast.success('Reservation created successfully!');
                await fetchTableData();
                updateState({ showReservationModal: false, selectedTable: null });
            }
        } catch (error) {
            console.error('Reservation error:', error);
            toast.error(error.response?.data?.message || 'Failed to create reservation');
        }
    };

    const handleTableClick = (table) => {
        if (!isAuthenticated) {
            toast.info('Please log in to make a reservation');
            navigate('/login');
            return;
        }

        if (table.status === 'OCCUPIED' || table.status === 'RESERVED') {
            toast.info(`Table ${table.tableNumber} is not available`);
            return;
        }

        updateState({
            selectedTable: table,
            showReservationModal: true,
        });
    };

    if (!isAuthenticated) {
        return <AuthPrompt restaurantName={state.restaurant?.name} />;
    }

    if (state.loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
            </div>
        );
    }

    return (
        <div className="container" data-testid="customer-table-view">
            <div className="header">
                <h1 className="header-title">
                    {state.restaurant?.name || 'Restaurant'} - Table Layout
                </h1>
                <button
                    onClick={() => updateState({ showReservationModal: true })}
                    className="button-primary"
                >
                    Make Future Reservation
                </button>
            </div>

            <div className="info-box">
                <p>Click on an available table to make a quick reservation</p>
            </div>

            <div className="status-indicator">
                {['Available', 'Occupied', 'Reserved'].map((status, index) => (
                    <div key={status} className="status-item">
                        <div
                            className={`status-dot ${
                                index === 0 ? 'status-available' : index === 1 ? 'status-occupied' : 'status-reserved'
                            }`}
                        />
                        <span>{status}</span>
                    </div>
                ))}
            </div>

            <div className="canvas-container">
                <Stage width={800} height={600}>
                    <Layer>
                        {state.background && <Image image={state.background} width={800} height={600} />}
                        {state.tables &&
                            state.tables.map((table) => (
                                <TableShape
                                    key={table.id}
                                    table={table}
                                    onClick={() => handleTableClick(table)}
                                    onMouseEnter={() => updateState((prev) => ({ ...prev, hoveredTable: table }))}
                                    onMouseLeave={() => updateState((prev) => ({ ...prev, hoveredTable: null }))}
                                    draggable={false}
                                />
                            ))}
                        {state.hoveredTable && (
                            <TableHoverInfo
                                table={state.hoveredTable}
                                mouseX={state.hoveredTable.xPosition}
                                mouseY={state.hoveredTable.yPosition}
                            />
                        )}
                    </Layer>
                </Stage>
            </div>

            {state.showReservationModal && state.selectedTable && (
                <QuickReservationDialog
                    isOpen={state.showReservationModal}
                    onClose={() => updateState({ showReservationModal: false, selectedTable: null })}
                    onSubmit={handleQuickReservation}
                    selectedTable={state.selectedTable}
                    restaurantId={restaurantId}
                />
            )}

            {state.showReservationModal && !state.selectedTable && (
                <ReservationModal
                    restaurant={state.restaurant}
                    isOpen={state.showReservationModal}
                    onClose={() => updateState({ showReservationModal: false })}
                    onSubmit={handleFutureReservation}  // Remove the immediate function call
                />
            )}
        </div>
    );
};

export default CustomerTableView;
