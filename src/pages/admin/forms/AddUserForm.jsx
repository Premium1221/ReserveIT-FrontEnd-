import { useState } from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import './AddUserForm.css';
import {toast} from "react-toastify";

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
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New User</h2>
                    <button
                        onClick={onClose}
                        className="close-button"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name *</label>
                        <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Role *</label>
                        <select
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="STAFF">Staff</option>
                            <option value="MANAGER">Manager</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    {(formData.role === 'STAFF' || formData.role === 'MANAGER') && (
                        <div className="form-group">
                            <label>Assign to Restaurant *</label>
                            <select
                                name="companyId"
                                required
                                value={formData.companyId}
                                onChange={handleChange}
                            >
                                <option value="">Select a restaurant</option>
                                {existingRestaurants.map(restaurant => (
                                    <option key={restaurant.id} value={restaurant.id}>
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
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
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