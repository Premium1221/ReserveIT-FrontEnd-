// pages/TableMapDemo.jsx
import TableMap from '../components/TableMap'; // Import the TableMap component
import './TableMapDemo.css'; // Separate CSS file for custom styling

const TableMapDemo = () => {
    return (
        <div className="table-map-demo">
            <h1>Table Availability Demo</h1>
            <p>Click on a table to toggle its occupancy status.</p>
            <div className="table-map-container">
                <TableMap />
            </div>
        </div>
    );
};

export default TableMapDemo;
