import { useState } from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import './AddUserForm.css';
import { toast } from 'react-toastify';

const AddUserForm = ({ onClose, onSubmit, existingRestaurants }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: 'CUSTOMER',
        companyId: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.role === 'MANAGER' && !formData.companyId) {
            toast.error('Please select a company for the manager');
            return;
        }
        onSubmit(formData);
        console.log("Form Data: ", formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="modal-overlay" data-testid="modal-overlay">
            <div className="modal-content" data-testid="add-user-modal">
                <div className="modal-header">
                    <h2 data-testid="modal-title">Add New User</h2>
                    <button
                        onClick={onClose}
                        className="close-button"
                        data-testid="close-button"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} data-testid="add-user-form">
                    <div className="form-group">
                        <label htmlFor="first-name">First Name *</label>
                        <input
                            id="first-name"
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            data-testid="first-name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="last-name">Last Name *</label>
                        <input
                            id="last-name"
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            data-testid="last-name"
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
                            data-testid="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone-number">Phone Number</label>
                        <input
                            id="phone-number"
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            data-testid="phone-number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role *</label>
                        <select
                            id="role"
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleChange}
                            data-testid="role"
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="STAFF">Staff</option>
                            <option value="MANAGER">Manager</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    {(formData.role === 'STAFF' || formData.role === 'MANAGER') && (
                        <div className="form-group">
                            <label htmlFor="company-id">Assign to Restaurant *</label>
                            <select
                                id="company-id"
                                name="companyId"
                                required
                                value={formData.companyId}
                                onChange={handleChange}
                                data-testid="restaurant-select"
                            >
                                <option value="">Select a restaurant</option>
                                {existingRestaurants.map(restaurant => (
                                    <option
                                        key={restaurant.id}
                                        value={restaurant.id}
                                        data-testid={`restaurant-option-${restaurant.id}`}
                                    >
                                        {restaurant.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-button"
                            data-testid="delete-user-button"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            data-testid="create-user-button"
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddUserForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    existingRestaurants: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    })).isRequired,
};

export default AddUserForm;
