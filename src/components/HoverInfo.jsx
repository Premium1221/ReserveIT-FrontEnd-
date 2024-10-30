// components/HoverInfo.jsx
import { Group, Rect, Text } from 'react-konva';

const HoverInfo = ({ x, y, capacity }) => (
    <Group x={x} y={y}>
        <Rect width={80} height={30} fill="white" stroke="black" strokeWidth={1} />
        <Text x={5} y={5} text={`Capacity: ${capacity}`} fontSize={12} fill="black" />
    </Group>
);

export default HoverInfo;
