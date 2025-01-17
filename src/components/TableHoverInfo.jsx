import { Group, Rect, Text } from 'react-konva';
import PropTypes from 'prop-types';

const TableHoverInfo = ({ table, mouseX, mouseY }) => {
    const padding = 10;
    const width = 180;
    const height = table.reservations?.length ? 100 + (table.reservations.length * 20) : 100;

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return '#22c55e';
            case 'OCCUPIED':
                return '#ef4444';
            case 'RESERVED':
                return '#eab308';
            default:
                return '#6b7280';
        }
    };

    return (
        <Group x={mouseX + 10} y={mouseY - height - 10}>
            {/* Background */}
            <Rect
                width={width}
                height={height}
                fill="white"
                stroke="#333"
                strokeWidth={1}
                cornerRadius={5}
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.2}
            />

            {/* Table Info */}
            <Text
                x={padding}
                y={padding}
                text={`Table ${table.tableNumber}`}
                fontSize={14}
                fontWeight="bold"
                fill="#333"
            />
            <Text
                x={padding}
                y={padding + 25}
                text={`Capacity: ${table.capacity} people`}
                fontSize={12}
                fill="#666"
            />
            <Text
                x={padding}
                y={padding + 45}
                text={`Status: ${table.status}`}
                fontSize={12}
                fill={getStatusColor(table.status)}
            />

            {/* Reservations Info */}
            {table.reservations?.length > 0 && (
                <>
                    <Text
                        x={padding}
                        y={padding + 65}
                        text="Today's Reservations:"
                        fontSize={12}
                        fontWeight="bold"
                        fill="#333"
                    />
                    {table.reservations.map((reservation, index) => (
                        <Text
                            key={reservation.id}
                            x={padding}
                            y={padding + 85 + (index * 20)}
                            text={`${formatTime(reservation.reservationDate)} - ${formatTime(reservation.endTime)}`}
                            fontSize={11}
                            fill="#666"
                        />
                    ))}
                </>
            )}
        </Group>
    );
};

TableHoverInfo.propTypes = {
    table: PropTypes.shape({
        id: PropTypes.number.isRequired,
        tableNumber: PropTypes.string.isRequired,
        capacity: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        reservations: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            reservationDate: PropTypes.string,
            endTime: PropTypes.string
        }))
    }).isRequired,
    mouseX: PropTypes.number.isRequired,
    mouseY: PropTypes.number.isRequired
};

export default TableHoverInfo;