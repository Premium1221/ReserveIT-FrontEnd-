import { useState } from 'react';
import { X, Trash2, Save } from 'lucide-react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import './TableEditor.css';

const TableEditor = ({ table, onClose, onSave, onDelete }) => {
    const [formData, setFormData] = useState({
        tableNumber: table.tableNumber || '',
        capacity: table.capacity || 4,
        shape: table.shape || 'CIRCLE',
        status: table.status || 'AVAILABLE',
        isOutdoor: Boolean(table.isOutdoor),
        xPosition: table.xPosition || 0,
        yPosition: table.yPosition || 0,
        companyId: table.companyId,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.tableNumber.trim()) {
            toast.error('Table number is required');
            return;
        }

        if (formData.capacity < 1) {
            toast.error('Capacity must be at least 1');
            return;
        }

        const updatedTable = {
            ...formData,
            tableNumber: formData.tableNumber.trim(),
            capacity: parseInt(formData.capacity),
        };

        try {
            setIsSubmitting(true);
            await onSave(updatedTable);
            onClose();
        } catch (error) {
            toast.error('Failed to update table');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="table-editor-overlay">
            <div className="table-editor-container">
                {/* Header */}
                <div className="editor-header">
                    <h2>Edit Table {table.tableNumber}</h2>
                    <button onClick={onClose} className="close-button">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="editor-form">
                    <div className="form-group">
                        <label>Table Number</label>
                        <input
                            type="text"
                            name="tableNumber"
                            value={formData.tableNumber}
                            onChange={handleChange}
                            className={errors.tableNumber ? 'input-error' : ''}
                            required
                        />
                        {errors.tableNumber && <p className="error-text">{errors.tableNumber}</p>}
                    </div>

                    <div className="form-group">
                        <label>Capacity</label>
                        <input
                            type="number"
                            name="capacity"
                            min="1"
                            max="12"
                            value={formData.capacity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Shape</label>
                        <select
                            name="shape"
                            value={formData.shape}
                            onChange={handleChange}
                        >
                            <option value="CIRCLE">Circle</option>
                            <option value="SQUARE">Square</option>
                            <option value="RECTANGLE">Rectangle</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="OCCUPIED">Occupied</option>
                            <option value="RESERVED">Reserved</option>
                            <option value="CLEANING">Cleaning</option>
                        </select>
                    </div>

                    <div className="form-group-inline">
                        <input
                            type="checkbox"
                            name="isOutdoor"
                            checked={formData.isOutdoor}
                            onChange={handleChange}
                        />
                        <label>Outdoor Table</label>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => onDelete(table.id)}
                            className="delete-button"
                        >
                            <Trash2 size={16} />
                            Delete Table
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="save-button"
                        >
                            <Save size={16} />
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

TableEditor.propTypes = {
    table: PropTypes.shape({
        id: PropTypes.number.isRequired,
        tableNumber: PropTypes.string.isRequired,
        capacity: PropTypes.number,
        shape: PropTypes.string,
        status: PropTypes.string,
        isOutdoor: PropTypes.bool,
        xPosition: PropTypes.number,
        yPosition: PropTypes.number,
        rotation: PropTypes.number,
        companyId: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default TableEditor;
