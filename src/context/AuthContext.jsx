import { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import api from "../config/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getRoleBasedRedirect = (role) => {
        switch (role) {
            case 'ADMIN':
                return '/admin-dashboard';
            case 'MANAGER':
                return '/restaurant-dashboard';
            case 'STAFF':
                return '/staff-dashboard';
            case 'CUSTOMER':
                return '/';
            default:
                return '/';
        }
    };
    const register = async (firstName, lastName, email, password, phoneNumber) => {
        try {
            const response = await api.post("/auth/register", {
                firstName,
                lastName,
                email,
                password,
                phoneNumber
            });

            if (response.data.accessToken) {
                sessionStorage.setItem("accessToken", response.data.accessToken);
                const decoded = parseToken(response.data.accessToken);
                if (decoded) {
                    setUser({
                        email: decoded.email,
                        role: decoded.role,
                        firstName: decoded.firstName,
                        lastName: decoded.lastName,
                        companyId: decoded.companyId,
                    });
                    setIsAuthenticated(true);
                    return { success: true };
                }
            }
            return { success: false, error: 'Registration failed' };
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const parseToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return {
                email: decoded.sub,
                role: decoded.role.replace("ROLE_", ""),
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                companyId: decoded.companyId,
                exp: decoded.exp,
            };
        } catch (error) {
            console.error("Error parsing token:", error);
            return null;
        }
    };

    const setupUserSession = (accessToken) => {
        const decoded = parseToken(accessToken);
        if (decoded) {
            sessionStorage.setItem("accessToken", accessToken);
            setUser({
                email: decoded.email,
                role: decoded.role,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                companyId: decoded.companyId,
            });
            setIsAuthenticated(true);


            return true;
        }
        return false;
    };

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            console.log('Login response:', response.data); // Debug log

            const { accessToken } = response.data;

            if (setupUserSession(accessToken)) {
                return { success: true };
            } else {
                throw new Error("Invalid token received");
            }
        } catch (error) {
            console.log('Login error response:', error.response?.data);
            return {

                success: false,
                error: error.response?.data?.message || "Invalid email or password",

            };
        }
    };

    const refreshToken = async () => {
        try {
            const response = await api.post("/auth/refresh", {}, { withCredentials: true });
            const { accessToken } = response.data;
            return setupUserSession(accessToken);
        } catch (error) {
            console.error("Token refresh failed:", error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout", {}, { withCredentials: true });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            sessionStorage.removeItem("accessToken");
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const accessToken = sessionStorage.getItem("accessToken");
                if (accessToken) {
                    const decoded = parseToken(accessToken);
                    if (decoded && decoded.exp * 1000 > Date.now()) {
                        setupUserSession(accessToken);
                    } else {
                        await refreshToken();
                    }
                } else {
                    await refreshToken();
                }
            } catch (error) {
                console.error("Error during authentication initialization:", error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);


    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                login,
                refreshToken,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
