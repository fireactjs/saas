import React from "react";
import { NavLink } from "react-router-dom";
import UserMenu from '../../menus/UserMenu';

const AppTemplate = ({ children }) => {
    return (
		<>
            <header class="app-header navbar">
                <button type="button" class="d-lg-none navbar-toggler" data-sidebar-toggler="true">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <NavLink className="navbar-brand" to="/">
                    <div className="navbar-brand-full">
                        <i className="fa fa-fire fa-2x text-warning"></i>
                    </div>
                    <div className="navbar-brand-full text-dark pl-2 font-weight-bold">FIREACT</div>
                </NavLink>
                <button type="button" className="d-md-down-none navbar-toggler" data-sidebar-toggler="true">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <ul className="ml-auto navbar-nav">
                    <UserMenu />
                </ul>
            </header>
            <div class="app-body">
                <div class="sidebar">

                </div>
                <main class="main">
                {children}
                </main>
            </div>
            <footer class="app-footer">

            </footer>
        </>
    )
}

export default AppTemplate;