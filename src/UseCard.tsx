import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from './store/hook';
import { User, deleteUser } from './store/UserSlice';

interface UseCardProps {
    user: User;
}

const UserCard: React.FC<UseCardProps> =({ user }) => {
    const dispatch = useAppDispatch();

    const handleDelete = () => {
        if(window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            dispatch(deleteUser(user.id));
        }
};
    return (
        <div className='user-card'>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.address.street}, {user.address.suite && `${user.address.suite}, `} {user.address.city}, {user.address.zipcode}</p>
            {user.phone && <p>Phone: {user.phone}</p>}

            <div className='button-group'>
                <Link to={`/users/${user.id}`} className="view-btn">View Details</Link>
                <Link to={`edit-user/${user.id}`} className="edit-btn">Edit</Link>
                <button onClick={handleDelete} className="delete-btn">Delete</button>
            </div>
        </div>
    );
};

export default UserCard;