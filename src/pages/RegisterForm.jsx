import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Phone } from 'lucide-react';
import './RegisterForm.css';
import api from '../config/axiosConfig';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        // Phone number validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            setError("Phone number must be 10 digits");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber
            });

            if (response.data.accessToken) {
                toast.success('Registration successful! Please log in.');
                navigate('/login');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                (err.response?.status === 409 ? "Email already exists" : "Registration failed");
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Create Account</h2>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister}>
                <div className="input-group">
                    <User size={20} />
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        minLength={2}
                        disabled={loading}
                    />
                </div>

                <div className="input-group">
                    <User size={20} />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        minLength={2}
                        disabled={loading}
                    />
                </div>

                <div className="input-group">
                    <Mail size={20} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        disabled={loading}
                    />
                </div>

                <div className="input-group">
                    <Phone size={20} />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number (10 digits)"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        pattern="\d{10}"
                        disabled={loading}
                    />
                </div>

                <div className="input-group">
                    <Lock size={20} />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        disabled={loading}
                    />
                </div>

                <div className="input-group">
                    <Lock size={20} />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    className="auth-button"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <div className="auth-footer">
                <p>
                    Already have an account? {' '}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;