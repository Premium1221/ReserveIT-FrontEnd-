import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../config/axiosConfig.jsx';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8080/api/auth/';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const validateToken = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            const storedUser = JSON.parse(localStorage.getItem('user'));

            if (accessToken && validateToken(accessToken) && storedUser) {
                setUser(storedUser);
                setIsAuthenticated(true);
            } else if (refreshToken) {
                try {
                    const response = await api.post(API_URL + 'refresh', { refreshToken });
                    const { accessToken: newAccessToken } = response.data;

                    localStorage.setItem('accessToken', newAccessToken);

                    if (storedUser) {
                        setUser(storedUser);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    // If refresh fails, it is gonna clear everything
                    logout();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post(API_URL + 'login', {
                email,
                password
            });

            const { accessToken, refreshToken } = response.data;
            // Decode the access token to get the role
            const decodedToken = jwtDecode(accessToken);
            const role = decodedToken.role;

            const userData = {
                email,
                role: role
            };

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);
            return { success: true, user: userData };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (firstName, lastName, email, password, phoneNumber) => {
        try {
            const response = await api.post(API_URL + 'register', {
                firstName,
                lastName,
                email,
                password,
                phoneNumber
            });

            const { accessToken, refreshToken } = response.data;
            const decodedToken = jwtDecode(accessToken);
            const role = decodedToken.role; // Get role from decoded token

            const userData = {
                email,
                role: role
            };

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);
            return { success: true, user: userData };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await api.post(API_URL + 'logout', { refreshToken });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    // Role checking functions
    const hasRole = (role) => user?.role === role && isAuthenticated;
    const isAdmin = () => hasRole('ADMIN');
    const isStaff = () => hasRole('STAFF');
    const isManager = () => hasRole('MANAGER');
    const isCustomer = () => hasRole('CUSTOMER');

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                login,
                logout,
                register,
                hasRole,
                isAdmin,
                isStaff,
                isManager,
                isCustomer
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};