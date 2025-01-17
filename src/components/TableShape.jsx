// Import the additional components and hooks we need
import { Circle, Rect, Text, Group } from 'react-konva';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';
import ArrivalTimeDialog from './ArrivalTimeDialog.jsx';


const TableShape = ({ table, draggable, onClick, onDragEnd }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [showArrivalDialog, setShowArrivalDialog] = useState(false);
    const { isAuthenticated, user } = useAuth();


    const formatTime = (dateTime) => {
        return new Date(dateTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTableColor = () => {
        switch (table.status) {
            case 'AVAILABLE':
                return 'rgba(34, 197, 94, 0.6)';
            case 'OCCUPIED':
                return 'rgba(239, 68, 68, 0.6)';
            case 'RESERVED':
                return 'rgba(234, 179, 8, 0.6)';
            default:
                return 'rgba(156, 163, 175, 0.6)';
        }
    };

    const handleClick = (e) => {
        if (draggable) {
            onClick(table);
            return;
        }

        if (!isAuthenticated && table.status === 'AVAILABLE') {
            e.cancelBubble = true;
            alert('Please log in or register to make a reservation');
            return;
        }

        if (e.target.getType() !== 'Text' && e.target.getType() !== 'Rect') {
            onClick(table);
        }
    };

    const handleDragEnd = (e) => {
        if (onDragEnd) {
            const newPos = {
                x: Math.round(e.target.x()),
                y: Math.round(e.target.y())
            };
            onDragEnd(newPos);
        }
    };

    const shapeProps = {
        x: table.xPosition,
        y: table.yPosition,
        draggable: draggable,
        fill: getTableColor(),
        stroke: '#000',
        strokeWidth: 1,
        onClick: handleClick,
        onDragEnd: handleDragEnd,
        onMouseEnter: () => setShowTooltip(true),
        onMouseLeave: () => setShowTooltip(false)
    };

    const shape = table.shape === 'CIRCLE' ? (
        <Circle {...shapeProps} radius={30} />
    ) : (
        <Rect
            {...shapeProps}
            width={60}
            height={60}
            offsetX={30}
            offsetY={30}
        />
    );
    const handleQuickReserve = (e) => {
        e.cancelBubble = true;
        if (isAuthenticated) {
            onClick({ ...table, showQuickReserve: true });
        }
    };
    return (
        <>
            <Group>
                {shape}
                <Text
                    x={table.xPosition - 20}
                    y={table.yPosition - 8}
                    text={`T${table.tableNumber}`}
                    fill="#000"
                    fontSize={14}
                    onClick={handleClick}
                />

                {!draggable && (
                    <>
                        {showTooltip && (
                            <Group>
                                {/* ... keep existing tooltip code ... */}
                            </Group>
                        )}

                        {table.status === 'AVAILABLE' && user?.role === 'CUSTOMER' && (
                            <Group>
                                <Rect
                                    x={table.xPosition - 40}
                                    y={table.yPosition + 35}
                                    width={80}
                                    height={25}
                                    fill="#6f42c1"
                                    cornerRadius={5}
                                    opacity={isAuthenticated ? 1 : 0.5}
                                    onClick={handleQuickReserve}
                                />
                                <Text
                                    x={table.xPosition - 35}
                                    y={table.yPosition + 40}
                                    text="Quick Reserve"
                                    fill="white"
                                    fontSize={11}
                                    onClick={handleQuickReserve}
                                />
                            </Group>
                        )}
                    </>
                )}
            </Group>

            {/* Move ArrivalTimeDialog outside of Konva components */}
            {showArrivalDialog && (
                <ArrivalTimeDialog
                    isOpen={showArrivalDialog}
                    onClose={() => setShowArrivalDialog(false)}
                    onSubmit={(minutes) => {
                        setShowArrivalDialog(false);
                        onClick({
                            ...table,
                            arrivalMinutes: minutes
                        });
                    }}
                />
            )}
        </>
    );
};

// Update PropTypes to include new properties
TableShape.propTypes = {
    table: PropTypes.shape({
        id: PropTypes.number.isRequired,
        tableNumber: PropTypes.string.isRequired,
        xPosition: PropTypes.number.isRequired,
        yPosition: PropTypes.number.isRequired,
        status: PropTypes.string,
        shape: PropTypes.string,
        capacity: PropTypes.number,
        reservations: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            reservationDate: PropTypes.string,
            endTime: PropTypes.string
        }))
    }).isRequired,
    draggable: PropTypes.bool,
    onClick: PropTypes.func,
    onDragEnd: PropTypes.func
};

export default TableShape;