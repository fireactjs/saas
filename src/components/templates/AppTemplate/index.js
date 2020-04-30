import React from "react";
import { NavLink } from "react-router-dom";
import UserMenu from '../../menus/UserMenu';
import AppMenu from '../../menus/AppMenu';

const AppTemplate = ({ children }) => {
    return (
		<div className="app">
            <header className="app-header navbar">
                <button type="button" className="d-lg-none navbar-toggler" data-sidebar-toggler="true" onClick={() => {
                    if(document.body.classList.contains("sidebar-show")){
                        document.body.classList.remove("sidebar-show");
                    }else{
                        document.body.classList.add("sidebar-show");
                    }
                }}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <NavLink className="navbar-brand" to="/">
                    <div className="navbar-brand-full">
                        <i className="fa fa-fire fa-2x text-warning"></i>
                    </div>
                    <div className="navbar-brand-full text-dark pl-2 font-weight-bold">FIREACT</div>
                </NavLink>
                <button type="button" className="d-md-down-none navbar-toggler" data-sidebar-toggler="true"  data-toggle="sidebar-show" onClick={() => {
                    if(document.body.classList.contains("sidebar-minimized")){
                        document.body.classList.remove("sidebar-minimized");
                    }else{
                        document.body.classList.add("sidebar-minimized");
                    }
                }}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <ul className="ml-auto navbar-nav">
                    <UserMenu />
                </ul>
            </header>
            <div className="app-body">
                <div className="sidebar">
                    <AppMenu />
                    <button className="sidebar-minimizer brand-minimizer" type="button" onClick={(e) => {
                        if(document.body.classList.contains("sidebar-minimized")){
                            document.body.classList.remove("sidebar-minimized");
                        }else{
                            document.body.classList.add("sidebar-minimized");
                        }
                    }} />
                </div>
                <main className="main">
                {children}
                </main>
            </div>
        </div>
    )
}

export default AppTemplate;