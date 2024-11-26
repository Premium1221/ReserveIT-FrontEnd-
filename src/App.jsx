import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginForm';
import RegisterPage from './pages/RegisterForm';
import MyReservationsPage from "./pages/MyReservations";
import TableMapDemo from './pages/TableMapDemo';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Header />
                    <main className="main-content">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/table-map-demo" element={<TableMapDemo />} />

                            {/* Protected Routes */}
                            <Route
                                path="/my-reservations"
                                element={
                                    <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                                        <MyReservationsPage />
                                    </ProtectedRoute>
                                }
                            />
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
                                    <ProtectedRoute allowedRoles={['MANAGER','ADMIN']}>
                                        <RestaurantDashboard />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>

                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;