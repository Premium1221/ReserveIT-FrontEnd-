import PropTypes from 'prop-types';

const StatusBadge = ({ status }) => {
    const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        CONFIRMED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800',
        COMPLETED: 'bg-blue-100 text-blue-800'
    };

    return (
        <span className={`status-badge ${statusColors[status] || ''}`}>
            {status}
        </span>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.oneOf(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).isRequired
};

export default StatusBadge;