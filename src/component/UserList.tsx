import { useEffect } from "react";
import { RootState } from '../store/store'; // Adjust the path to your store definition
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers } from "../store/UserSlice";
import { Link } from 'react-router-dom'
import UserCard from "./UseCard";


const UserList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { users, status, error } = useAppSelector((state: RootState) => state.users);

    useEffect(() => {
        // Only fetch if we don't have users yet
        if (status === 'waiting'){
            dispatch(fetchUsers());
        }
    },  [status, dispatch]);
        if (status === 'loading...'){
            return <div>Loading users...</div>;
        }
        if (status === 'failed'){
            return <div>Error: {error}</div>;
        }
    return (
        <div>
            <div>
                <h2>Users</h2>
                <Link to="/add-user">Add New User</Link>
            </div>

            {users.length === 0 ? (
                <div>No users found.</div>
            ) : (
                <div>{users.map(user => (
                    <UserCard key={user.id} user={user} />
                ))}
                </div>
            )}
        </div>
    );
};

export default UserList;