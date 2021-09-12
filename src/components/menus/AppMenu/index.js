import React, { useEffect } from "react";
import SidebarLink from '../SidebarLink';

const AppMenu = () => {


    return (

            <ul className="c-sidebar-nav ps ps--active-y">
                <li className="c-sidebar-nav-title">Application</li>
                <li className="c-sidebar-nav-item">
                    <SidebarLink className={"c-sidebar-nav-link"+(window.location.pathname==='/'?" active":"")} to="/">
                        <i className="c-sidebar-nav-icon fa fa-th-large"></i>My Accounts
                    </SidebarLink>
                </li>
                <li className="c-sidebar-nav-title">User</li>
                <li className="c-sidebar-nav-item">
                    <SidebarLink className={"c-sidebar-nav-link"+(window.location.pathname.startsWith('/user/profile')?" active":"")} to="/user/profile">
                        <i className="c-sidebar-nav-icon fa fa-user"></i> Profile
                    </SidebarLink>
                </li>
                <li className="c-sidebar-nav-item">
                    <SidebarLink className={"c-sidebar-nav-link"+(window.location.pathname.startsWith('/user/log')?" active":"")} to="/user/log">
                        <i className="c-sidebar-nav-icon fa fa-list"></i> Activity Logs
                    </SidebarLink>
                </li>
            </ul>

    )
}

export default AppMenu;