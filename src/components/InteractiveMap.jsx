import { Stage, Layer, Image } from 'react-konva';
import PropTypes from 'prop-types';
import TableShape from './TableShape.jsx';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './InteractiveMap.css';

const InteractiveMap = ({ tables, modifiedTables, onTablePositionUpdate, onTableSelect, mode }) => {
    const [background, setBackground] = useState(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = '/src/assets/table-map.png';
        img.onload = () => setBackground(img);
        img.onerror = () => toast.error('Failed to load background image');
    }, []);

    const handleDragEnd = (tableId, newPosition) => {
        const updatedPosition = {
            x: Math.round(newPosition.x),
            y: Math.round(newPosition.y),
        };
        onTablePositionUpdate(tableId, updatedPosition);
    };

    return (
        <div className="interactive-map-container">
            <div className="map-wrapper">
                <Stage width={800} height={600}>
                    <Layer>
                        {background && (
                            <Image image={background} width={800} height={600} />
                        )}
                        {tables.map((table) => (
                            <TableShape
                                key={table.id}
                                table={{
                                    ...table,
                                    xPosition: Number(table.xPosition),
                                    yPosition: Number(table.yPosition),
                                }}
                                draggable={mode === "edit"}
                                onClick={() => onTableSelect(table)}
                                onDragEnd={(newPos) => handleDragEnd(table.id, newPos)}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

InteractiveMap.propTypes = {
    tables: PropTypes.arrayOf(PropTypes.object).isRequired,
    modifiedTables: PropTypes.array,
    onTablePositionUpdate: PropTypes.func.isRequired,
    onTableSelect: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['view', 'edit']),
};

InteractiveMap.defaultProps = {
    modifiedTables: [],
    mode: 'view',
};

export default InteractiveMap;
