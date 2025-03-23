import React from "react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/users" className="navbar-brand">User Management System</Link>
                <div className="navbar-links">
                    <Link to="/users" className="nav-link">Users</Link>
                    <Link to="/add-user" className="nav-link">Add User</Link>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;