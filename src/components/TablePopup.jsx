// components/TablePopup.jsx
import { Group, Rect, Text } from 'react-konva';
import PropTypes from 'prop-types';

const TablePopup = ({ table, onClose }) => (
    <Group x={table.xPosition + 50} y={table.yPosition - 50}>
        <Rect width={150} height={100} fill="white" stroke="black" strokeWidth={1} />
        <Text x={10} y={10} text={`Table ${table.number}`} fontSize={16} fill="black" />
        <Text x={10} y={30} text={`From ${Math.ceil(table.capacity / 2)} to ${table.capacity} people`} fontSize={14} fill="black" />
        <Text x={10} y={50} text="Reserve" fontSize={14} fill="blue" onClick={() => alert(`Reserving Table ${table.number}`)} />
        <Text x={120} y={5} text="X" fontSize={16} fill="red" onClick={onClose} style={{ cursor: 'pointer' }} />
    </Group>
);

TablePopup.propTypes = {
    table: PropTypes.shape({
        xPosition: PropTypes.number.isRequired,
        yPosition: PropTypes.number.isRequired,
        number: PropTypes.number.isRequired,
        capacity: PropTypes.number.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default TablePopup;
