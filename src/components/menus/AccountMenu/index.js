import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarLink from '../SidebarLink';
import { AuthContext } from '../../FirebaseAuth';

const AccountMenu = () => {

    const { accountId } = useParams();

    const { userData } = useContext(AuthContext);

    useEffect(() => {
        document.querySelectorAll('.c-sidebar').forEach(element => {
            window.coreui.Sidebar._sidebarInterface(element)
        });
    })

    return (

            <ul className="c-sidebar-nav ps ps--active-y">
                <li className="c-sidebar-nav-title">Account</li>
                <li className="c-sidebar-nav-item">
                    <SidebarLink className={"c-sidebar-nav-link"+(window.location.pathname==='/account/'+accountId+'/'?" active":"")} to={'/account/'+accountId+'/'}>
                        <i className="c-sidebar-nav-icon fa fa-tachometer-alt"></i>Overview
                    </SidebarLink>
                </li>
                {userData.currentAccount.role === 'admin' && 
                <>
                    <li className="c-sidebar-nav-title">Settings</li>
                    <li className="c-sidebar-nav-item">
                        <SidebarLink className={"c-sidebar-nav-link"+(window.location.pathname.startsWith('/account/'+accountId+'/users')?" active":"")} to={'/account/'+accountId+'/users'}>
                            <i className="c-sidebar-nav-icon fa fa-users"></i>Manage Users
                        </SidebarLink>
                    </li>
                    <li className="c-sidebar-nav-item">
                        <SidebarLink className={"c-sidebar-nav-link"+(window.location.pathname.startsWith('/account/'+accountId+'/billing')?" active":"")} to={'/account/'+accountId+'/billing'}>
                            <i className="c-sidebar-nav-icon fa fa-file-invoice-dollar"></i>Billing
                        </SidebarLink>
                    </li>
                </>
                }
            </ul>
    )
}

export default AccountMenu;