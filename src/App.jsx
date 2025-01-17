import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {AuthProvider, useAuth} from './context/AuthContext';
import { Suspense } from 'react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Components
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginForm';
import RegisterPage from './pages/RegisterForm';
import MyReservationsPage from "./pages/MyReservations";
import AdminDashboard from './pages/admin/AdminDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import CustomerTableView from "./components/CustomerTableView";
import TableManagementPage from "@/pages/TableManagementPage.jsx";

// Styles
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ProtectedRoute from "@/components/ProtectedRoute";
import StaffDashboard from "@/pages/StaffDashboard.jsx";
import NotificationDropdown from "@/components/NotificationDropdown.jsx";

function App() {

    return (
        <AuthProvider>
            <DndProvider backend={HTML5Backend}>
                <Router>
                    <div className="app-container">
                        <Header />
                        <main className="main-content">
                            <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />

                                    {/* Protected Routes */}
                                    <Route path="/my-reservations" element={<MyReservationsPage />} />
                                    <Route
                                        path="/admin-dashboard"
                                        element={
                                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                                <AdminDashboard />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/restaurant-dashboard"
                                        element={
                                            <ProtectedRoute allowedRoles={['MANAGER']}>
                                                <RestaurantDashboard />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/table-management"
                                        element={
                                            <ProtectedRoute allowedRoles={['MANAGER']}>
                                                <TableManagementPage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/restaurant/:restaurantId/tables"
                                        element={
                                            <ProtectedRoute allowedRoles={['CUSTOMER']}>
                                                <CustomerTableView />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/staff-dashboard"
                                        element={
                                            <ProtectedRoute allowedRoles={['STAFF', 'MANAGER']}>
                                                <>
                                                    <StaffDashboard />
                                                </>
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </Suspense>
                        </main>
                        <ToastContainer />
                    </div>
                </Router>
            </DndProvider>
        </AuthProvider>
    );
}

export default App;