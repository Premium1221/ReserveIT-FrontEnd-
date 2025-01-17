import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner message="Verifying access..." />;
    }

    if (!isAuthenticated || !user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // Check if user has the required role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        toast.error(`Access denied. Required role: ${allowedRoles.join(' or ')}`);

        return <Navigate to="/" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;