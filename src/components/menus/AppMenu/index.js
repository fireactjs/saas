import React from "react";

const AppMenu = () => {
    return (
        <nav className="sidebar-nav">
            <ul className="nav">
                <li className="nav-title">Nav Title</li>
                <li className="nav-item">
                    <a className="nav-link" href="#">
                        <i className="nav-icon cui-speedometer"></i> Nav item
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default AppMenu;