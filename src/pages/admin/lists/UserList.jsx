import { Edit2, Trash2, Building2 } from 'lucide-react';
import PropTypes from 'prop-types';

const UserList = ({ users, onDelete, onEdit }) => {
    return (
        <div className="items-grid" data-testid="users-grid">
            {users.map((user) => (
                <div key={user.id} className="item-card" data-testid="user-card">
                    <div className="item-header">
                        <h3 data-testid="user-name">{user.firstName} {user.lastName}</h3>
                        <div className="user-details">
                            <p data-testid="user-email">{user.email}</p>
                            {user.phoneNumber && (
                                <p data-testid="user-phone">📞 {user.phoneNumber}</p>
                            )}
                        </div>
                        <span className={`role ${user.role.toLowerCase()}`} data-testid="user-role">
                            {user.role}
                        </span>
                        {(user.role === 'STAFF' || user.role === 'MANAGER') && user.companyName && (
                            <div className="company-info" data-testid="user-company">
                                <Building2 size={16}/>
                                <span>{user.companyName}</span>
                            </div>
                        )}
                    </div>

                    <div className="item-actions">
                        <button
                            onClick={() => onEdit(user)}
                            className="edit-button"
                            data-testid="edit-user-button"
                        >
                            <Edit2 size={16}/>
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(user.id)}
                            className="delete-button"
                            data-testid="delete-user-button"
                        >
                            <Trash2 size={16}/>
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