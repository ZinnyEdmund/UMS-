import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../Stores/hook';
import { User, deleteUser } from '../Stores/UserSlice';

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
        <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.address.street}, {user.address.suite && `${user.address.suite}, `} {user.address.city}, {user.address.zipcode}</p>
            {user.phone && <p>Phone: {user.phone}</p>}

            <div>
                <Link to={`/users/${user.id}`}>View Details</Link>
                <Link to={`edit-user/${user.id}`}>Edit</Link>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

export default UserCard;