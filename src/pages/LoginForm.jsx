import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './LoginForm.css';
import { useRoleBasedRedirect } from "@/hooks/useRoleBasedRedirect.jsx";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const redirectBasedOnRole = useRoleBasedRedirect();

    const navigate = useNavigate();
    const location = useLocation();
    const { login, user } = useAuth();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await login(email, password);
            if (!result.success) {
                setError(result.error || 'Invalid email or password');
                return;
            }
            toast.success('Welcome back!');
            redirectBasedOnRole(location.state?.from?.pathname);
        } catch (error) {
            // Check if it's an authentication error
            if (error.response?.status === 401) {
                setError('Invalid email or password');
            } else {
                setError(error.response?.data?.message || 'Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" data-testid="login-form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} data-testid="login-form">
                {error && (
                    <div
                        className="error-message visible"
                        data-testid="login-error"
                    >
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        data-testid="email-input"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        data-testid="password-input"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        maxLength={50}
                        disabled={loading}
                        autoComplete="current-password"
                    />
                </div>
                <button
                    type="submit"
                    className="auth-button"
                    data-testid="login-button"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <div className="auth-footer">
                <p>
                    Don&#39;t have an account?{' '}
                    <a href="/register" data-testid="register-link">Register</a>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;