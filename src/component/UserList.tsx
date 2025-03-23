import { useEffect, useState } from "react";
import { RootState } from '../store/store'; // Adjust the path to your store definition
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchUsers } from "../store/UserSlice";
import { Link } from 'react-router-dom'
import UserCard from "../UseCard";


const UserList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { users, status, error } = useAppSelector((state: RootState) => state.users as { users: { id: string | number; name: string; email: string; }[]; status: string; error: string | null });
    // To track search input
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Only fetch if we don't have users yet
        if (status === 'idle'){
            dispatch(fetchUsers());
        }

    },  [status, dispatch]);
        if (status === 'loading...'){
            return <div className="loading-message">Loading users...</div>;
        }
        if (status === 'failed'){
            return <div className="error-message">Error: {error}</div>;
        }

        // Filter users based on search input
        const filteredUsers = users.filter((user) => {
            return user.name && typeof user.name === "string" && user.name.toLowerCase().includes(searchTerm.toLowerCase());
        });

    return (
        <div className="user-list-container">
            <div className="user-list-header">
                <h2>Users</h2>
                <Link to="/add-user" className="add-user-btn">Add New User</Link>
            </div>

            {/* Search bar */}
            <input type="text" 
            className="search-bar" 
            placeholder="Search users by name..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            

            {filteredUsers.length === 0 ? (
                <div className="no-users-message">No users found.</div>
            ) : (
                <div className="user-list-grid">{filteredUsers.map((user: { id: string | number; }) => (
                    <UserCard key={user.id} user={user} />
                ))}
                </div>
            )}
        </div>
    );
};

export default UserList;