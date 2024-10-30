// components/TableShape.jsx
import { Circle, Rect, Ellipse, Text } from 'react-konva';
import PropTypes from 'prop-types';

const TableShape = ({ table, onClick, onMouseEnter, onMouseLeave }) => {
    const color = table.isOccupied ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)';
    const shapeProps = {
        fill: color,
        stroke: 'black',
        strokeWidth: 2,
        onClick,
        onMouseEnter,
        onMouseLeave,
    };

    return (
        <>
            {table.shape === 'circle' && (
                <Circle x={table.xPosition} y={table.yPosition} radius={30} {...shapeProps} />
            )}
            {table.shape === 'square' && (
                <Rect x={table.xPosition - 30} y={table.yPosition - 30} width={60} height={60} {...shapeProps} />
            )}
            {table.shape === 'rectangle' && (
                <Rect x={table.xPosition - 45} y={table.yPosition - 20} width={90} height={40} {...shapeProps} />
            )}
            {table.shape === 'oval' && (
                <Ellipse x={table.xPosition} y={table.yPosition} width={90} height={40} {...shapeProps} />
            )}
            {table.shape === 'booth' && (
                <Rect x={table.xPosition - 45} y={table.yPosition - 20} width={90} height={40} cornerRadius={10} {...shapeProps} />
            )}
            <Text x={table.xPosition - 20} y={table.yPosition - 50} text={`Table ${table.number}`} fontSize={15} fill="black" />
        </>
    );
};

TableShape.propTypes = {
    table: PropTypes.shape({
        xPosition: PropTypes.number.isRequired,
        yPosition: PropTypes.number.isRequired,
        number: PropTypes.number.isRequired,
        capacity: PropTypes.number,
        isOccupied: PropTypes.bool.isRequired,
        shape: PropTypes.oneOf(['circle', 'square', 'rectangle', 'oval', 'booth']).isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
};

export default TableShape;
