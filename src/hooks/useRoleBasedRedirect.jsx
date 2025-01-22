import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useRoleBasedRedirect = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const redirectBasedOnRole = (overridePath = null) => {
        if (!user) return;

        const path = overridePath || (() => {
            switch (user.role) {
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
        })();

        navigate(path, { replace: true });
    };

    return redirectBasedOnRole;
};