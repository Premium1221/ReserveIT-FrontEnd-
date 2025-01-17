import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../config/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const refreshToken = async () => {
        try {
            const response = await api.post("/auth/refresh");
            const { accessToken } = response.data;
            return setupUserSession(accessToken);
        } catch (error) {
            console.error("Token refresh failed:", error);
            return false;
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { accessToken } = response.data;

            if (setupUserSession(accessToken)) {
                return { success: true };
            } else {
                throw new Error("Invalid token received");
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Login failed",
            };
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            sessionStorage.removeItem("accessToken");
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        let refreshInterval;

        if (isAuthenticated) {
            refreshInterval = setInterval(async () => {
                const success = await refreshToken();
                if (!success) {
                    clearInterval(refreshInterval);
                    logout();
                }
            }, 840000); // Refresh every 14 minutes (token expires at 15)
        }

        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, [isAuthenticated]);

    // Initial auth check
    useEffect(() => {
        const checkAuth = async () => {
            const token = sessionStorage.getItem("accessToken");
            if (token) {
                const decoded = parseToken(token);
                if (decoded && decoded.exp * 1000 > Date.now()) {
                    setupUserSession(token);
                } else {
                    const success = await refreshToken();
                    if (!success) {
                        sessionStorage.removeItem("accessToken");
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                login,
                logout,
                refreshToken,
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