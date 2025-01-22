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
                to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`}
                replace
            />
        );
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        toast.error(`Access denied. Required role: ${allowedRoles.join(' or ')}`);

        const redirectPath = getRoleBasedPath(user.role);
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

const getRoleBasedPath = (role) => {
    switch (role) {
        case 'ADMIN':
            return '/admin-dashboard';
        case 'MANAGER':
            return '/restaurant-dashboard';
        case 'STAFF':
            return '/staff-dashboard';
        case 'CUSTOMER':
        default:
            return '/';
    }
};
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;