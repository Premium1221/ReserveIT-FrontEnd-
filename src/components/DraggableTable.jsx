import React, { forwardRef } from 'react';
import { useDrag } from 'react-dnd';
import { Square, Circle } from 'lucide-react';
import PropTypes from 'prop-types';
import TableStatusToggle from './TableStatusToggle';

const DraggableTable = forwardRef(({ table, isManager, onSelect, isSelected, onStatusChange }, ref) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'table',
        item: { id: table.id },
        canDrag: isManager,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const statusColors = {
        AVAILABLE: 'bg-green-100 hover:bg-green-200',
        OCCUPIED: 'bg-red-100',
        RESERVED: 'bg-yellow-100',
        CLEANING: 'bg-blue-100',
    };

    return (
        <div
            ref={(node) => {
                drag(node);
                if (ref) ref(node);
            }}
            className={`absolute cursor-pointer transform transition-all duration-200
                ${statusColors[table.status]} 
                ${isSelected ? 'ring-2 ring-purple-500' : ''}
                ${isDragging ? 'opacity-50 scale-105' : 'opacity-100'}
                rounded-lg p-2`}
            style={{
                left: `${table.xPosition}px`,
                top: `${table.yPosition}px`,
                transform: `rotate(${table.rotation || 0}deg)`,
            }}
            onClick={() => onSelect(table)}
        >
            <div className="flex flex-col items-center justify-center">
                {table.shape === 'CIRCLE' ? (
                    <Circle size={40} className="text-gray-600" />
                ) : (
                    <Square size={40} className="text-gray-600" />
                )}
                <span className="text-xs font-medium mt-1">Table {table.tableNumber}</span>
                <span className="text-xs">({table.capacity} seats)</span>

                {isManager && (
                    <div className="mt-2">
                        <TableStatusToggle
                            currentStatus={table.status}
                            onStatusChange={(status) => onStatusChange(table.id, status)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

DraggableTable.displayName = 'DraggableTable';

DraggableTable.propTypes = {
    table: PropTypes.shape({
        id: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        xPosition: PropTypes.number.isRequired,
        yPosition: PropTypes.number.isRequired,
        rotation: PropTypes.number,
        shape: PropTypes.string.isRequired,
        tableNumber: PropTypes.string.isRequired,
        capacity: PropTypes.number.isRequired,
    }).isRequired,
    isManager: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onStatusChange: PropTypes.func.isRequired,
};

export default DraggableTable;
