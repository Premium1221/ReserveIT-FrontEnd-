import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../config/axiosConfig";
import CustomerInteractiveMap from "./CustomerInteractiveMap";
import "./TableViewModal.css";

const TableViewModal = ({ restaurant, isOpen, onClose, onMakeReservation }) => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchTables();
        }
    }, [isOpen]);

    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/tables/restaurant/${restaurant.id}/tables`);
            setTables(response.data);
        } catch (error) {
            console.error("Failed to fetch tables", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableSelect = (table) => {
        if (table.status !== "AVAILABLE") {
            alert("This table is not available.");
            return;
        }
        onMakeReservation(table.id);
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <button onClick={onClose} className="close-button">Close</button>
                {loading ? (
                    <p>Loading map...</p>
                ) : (
                    <CustomerInteractiveMap
                        tables={tables}
                        onTableSelect={handleTableSelect}
                    />
                )}
            </div>
        </div>
    );
};

TableViewModal.propTypes = {
    restaurant: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onMakeReservation: PropTypes.func.isRequired,
};

export default TableViewModal;
