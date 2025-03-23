import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hook';
import { RootState } from '../store/store'; // Adjust the path if necessary
import { deleteUser, fetchUsers } from '../store/UserSlice';

const UserDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const { users, status } = useAppSelector((state: RootState) => state.users as { users: Array<{ id: number; name: string; email: string; phone?: string; address: { street: string; suite?: string; city: string; zipcode: string; }; }>; status: string; });
    const user = users.find((u: { id: number; }) => u.id === Number(id));

    useEffect(() => {
        // If we don't have any user yet, fetch them...
        if (status === 'idle'){
            dispatch(fetchUsers());
        }
    }, [status, dispatch]);

    const handleDelete = () => {
        if (user && window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            dispatch(deleteUser(user.id));
            navigate('/users');
        }
    };

    if (status === 'loading...'){
        return <div className="loading-message">Loading user...</div>;
    }
    if (!user){
        return (
            <div className="not-found-message">
            <p>User not found.</p>
            <Link to="/users" className="back-btn">Back to User</Link>
            </div>
        );
    }
    return (
        <div className="user-detail-container">
                <h2 className="user-detail-header">{user.name}</h2>
                <div className="user-info-grid">
                    <div className="user-info-section">
                        <h3>Contact Info</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                    </div>

                    <div className="user-info-setions">
                        <h3>Address</h3>
                        <p>{user.address.street}</p>
                        {user.address.suite && <p>{user.address.suite}</p>}
                        <p>{user.address.city}, {user.address.zipcode}</p>
                    </div>
                </div>
            
                <div className="user-detail-actions">
                    <Link to="users" className="back-btn">Back to Users</Link>
                    <Link to={`/edit-user/${user.id}`} className="edit-btn">Edit User</Link>
                    <button onClick={handleDelete} className="delete-btn">Delete User</button>
                </div>
            </div>
    );
};


export default UserDetail;