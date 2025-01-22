import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {AuthProvider, useAuth} from './context/AuthContext';
import { Suspense } from 'react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Components
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginForm';
import RegisterPage from './pages/RegisterForm';
import MyReservationsPage from './pages/MyReservations';
import AdminDashboard from './pages/admin/AdminDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import CustomerTableView from './components/CustomerTableView';
import TableManagementPage from './pages/TableManagementPage';
import StaffDashboard from './pages/StaffDashboard';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route
                path="/login"
                element={
                    user ? (
                        <Navigate
                            to={
                                user.role === 'ADMIN' ? '/admin-dashboard' :
                                    user.role === 'MANAGER' ? '/restaurant-dashboard' :
                                        user.role === 'STAFF' ? '/staff-dashboard' :
                                            '/'
                            }
                            replace
                        />
                    ) : (
                        <LoginPage />
                    )
                }
            />
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
                        <StaffDashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
function App() {
    return (
        <AuthProvider>
            <DndProvider backend={HTML5Backend}>
                <Router>
                    <div className="app-container">
                        <Header />
                        <main className="main-content">
                            <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
                                <AppRoutes />
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