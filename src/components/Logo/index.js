import React from "react";
import { NavLink } from "react-router-dom";

const Logo = () => {
    return (
        <>
            <NavLink className="c-sidebar-brand-full" to="/">
                <h4 className="text-light c-sidebar-brand-full">
                    <i className="fa fa-fire text-warning c-sidebar-brand-full mr-2"></i>
                    FIREACT
                </h4>
            </NavLink>
            <NavLink className="c-sidebar-brand-minimized" to="/">
            <h4 className="c-sidebar-brand-minimized">
                <i className="fa fa-fire text-warning c-sidebar-brand-minimized"></i>
            </h4>
            </NavLink>
        </>
    )
}

export default Logo;