import { Edit2, Trash2, Building2 } from 'lucide-react';
import PropTypes from 'prop-types';

const UserList = ({ users, onDelete, onEdit }) => {
    return (
        <div className="items-grid">
            {users.map((user) => (
                <div key={user.id} className="item-card">
                    <div className="item-header">
                        <h3>{user.firstName} {user.lastName}</h3>
                        <div className="user-details">
                            <p className="email">{user.email}</p>
                            {user.phoneNumber && (
                                <p className="phone">📞 {user.phoneNumber}</p>
                            )}
                        </div>
                        <span className={`role ${user.role.toLowerCase()}`}>
                            {user.role}
                        </span>
                        {(user.role === 'STAFF' || user.role === 'MANAGER') && user.companyName && (
                            <div className="company-info">
                                <Building2 size={16} />
                                <span>{user.companyName}</span>
                            </div>
                        )}
                    </div>

                    <div className="item-actions">
                        <button
                            onClick={() => onEdit(user)}
                            className="edit-button"
                        >
                            <Edit2 size={16} />
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(user.id)}
                            className="delete-button"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

UserList.propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        phoneNumber: PropTypes.string,
        companyName: PropTypes.string,
    })).isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default UserList;