import { Stage, Layer, Image } from 'react-konva';
import PropTypes from 'prop-types';
import TableShape from './TableShape.jsx';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const CustomerInteractiveMap = ({ tables, onTableSelect }) => {
    const [background, setBackground] = useState(null);

    useEffect(() => {
        const img = new window.Image();
        img.src = '/src/assets/table-map.png';
        img.onload = () => setBackground(img);
        img.onerror = () => toast.error('Failed to load background image');
    }, []);

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <div className="border rounded-lg bg-gray-50 p-4">
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
                                draggable={false}
                                onClick={() => onTableSelect(table)}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

CustomerInteractiveMap.propTypes = {
    tables: PropTypes.arrayOf(PropTypes.object).isRequired,
    onTableSelect: PropTypes.func.isRequired,
};

export default CustomerInteractiveMap;
