import React from "react";
import { Link } from "react-router-dom";

const AppMenu = () => {
    return (
        <nav className="sidebar-nav">
            <ul className="nav">
                <li className="nav-title">Application</li>
                <li className="nav-item">
                    <Link className="nav-link" to="/">
                        <i className="nav-icon fa fa-fire"></i> Dashboard
                    </Link>
                </li>
                <li className="nav-title">User</li>
                <li className="nav-item">
                    <Link className="nav-link" to="/user/profile">
                        <i className="nav-icon fa fa-user"></i> Profile
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/user/log">
                        <i className="nav-icon fa fa-list"></i> Activity Log
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default AppMenu;