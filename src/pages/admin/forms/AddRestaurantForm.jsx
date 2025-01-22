import { useState } from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import './AddRestaurantForm.css';
import { toast } from 'react-toastify';

const AddRestaurantForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.address) {
            toast.error('Please fill in all required fields.');
            return;
        }
        onSubmit(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="modal-overlay" data-testid="modal-overlay">
            <div className="modal-content" data-testid="add-restaurant-modal">
                <div className="modal-header">
                    <h2 data-testid="modal-title">Add New Restaurant</h2>
                    <button
                        onClick={onClose}
                        className="close-button"
                        data-testid="close-button"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} data-testid="add-restaurant-form">
                    <div className="form-group">
                        <label htmlFor="name">Name *</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            data-testid="restaurant-name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            data-testid="restaurant-email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address *</label>
                        <input
                            id="address"
                            type="text"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            data-testid="restaurant-address"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            data-testid="restaurant-phone"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-button"
                            data-testid="cancel-add-restaurant"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            data-testid="create-restaurant-button"
                        >
                            Create Restaurant
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddRestaurantForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default AddRestaurantForm;
