import React, {useState} from "react";
import UserMenu from '../../menus/UserMenu';
import AppMenu from '../../menus/AppMenu';
import Logo from '../../Logo';
import {BreadcrumbContext, Breadcrumb} from '../../Breadcrumb';


const AppTemplate = ({ children }) => {

    const [breadcrumb, setBreadcrumb] = useState([]);

    return (
		<div className="c-app">
            <div className="c-sidebar c-sidebar-dark c-sidebar-fixed c-sidebar-lg-show" id="sidebar">
                <div className="c-sidebar-brand d-md-down-none">
                    <Logo />
                </div>
                <AppMenu />
                <button className="c-sidebar-minimizer c-class-toggler" data-target="_parent" data-class="c-sidebar-minimized" type="button" />
            </div>
            
            <div className="c-wrapper">
                <header className="c-header c-header-light c-header-fixed">
                    <button className="c-header-toggler c-class-toggler d-lg-none mfe-auto" type="button" data-target="#sidebar" data-class="c-sidebar-show">
                        <i className="mt-3 fa fa-bars" />
                    </button>
                    <div className="mfe-auto">
                        <button className="c-header-toggler c-class-toggler mfs-3 d-md-down-none" data-target="#sidebar" data-class="c-sidebar-lg-show">
                            <i className="mt-3 fa fa-bars" />
                        </button>
                    </div>
                    <ul className="c-header-nav">
                        <UserMenu />
                    </ul>
                    <Breadcrumb links={breadcrumb} />
                </header>
                <div className="c-body">
                    <main className="c-main">
                    <BreadcrumbContext.Provider value={{setBreadcrumb}}>
                    {children}
                    </BreadcrumbContext.Provider>
                    </main>
                </div>
            </div>
            
        </div>
    )
}

export default AppTemplate;