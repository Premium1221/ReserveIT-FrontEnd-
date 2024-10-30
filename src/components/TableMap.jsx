// components/TableMap.jsx
import { useState, useRef } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';
import tableMap from '../assets/table-map.png';
import TableShape from './TableShape';
import HoverInfo from './HoverInfo';
import TablePopup from './TablePopup';

const initialTableData = [
    { id: 1, number: 1, isOccupied: false, xPosition: 630, yPosition: 175, shape: 'circle', capacity: 6 },
    { id: 2, number: 2, isOccupied: true, xPosition: 265, yPosition: 75, shape: 'square', capacity: 2 },
    { id: 3, number: 3, isOccupied: false, xPosition: 400, yPosition: 100, shape: 'rectangle', capacity: 4 },
    { id: 4, number: 4, isOccupied: true, xPosition: 550, yPosition: 100, shape: 'oval', capacity: 3 },
    { id: 5, number: 5, isOccupied: false, xPosition: 700, yPosition: 100, shape: 'booth', capacity: 6 },
];

const TableMap = () => {
    const [tables] = useState(initialTableData);  // Only use `tables`, not `setTables`
    const [backgroundImage] = useImage(tableMap);
    const stageRef = useRef();
    const [selectedTable, setSelectedTable] = useState(null);
    const [hoveredTable, setHoveredTable] = useState(null);

    return (
        <Stage width={800} height={600} ref={stageRef}>
            <Layer>
                <Image image={backgroundImage} x={0} y={0} width={800} height={600} />

                {tables.map((table) => (
                    <TableShape
                        key={table.id}
                        table={table}
                        onClick={() => setSelectedTable(table)}
                        onMouseEnter={() => setHoveredTable(table)}
                        onMouseLeave={() => setHoveredTable(null)}
                    />
                ))}

                {hoveredTable && (
                    <HoverInfo
                        x={hoveredTable.xPosition + 10}
                        y={hoveredTable.yPosition - 20}
                        capacity={hoveredTable.capacity}
                    />
                )}

                {selectedTable && (
                    <TablePopup
                        table={selectedTable}
                        onClose={() => setSelectedTable(null)}
                    />
                )}
            </Layer>
        </Stage>
    );
};

export default TableMap;
