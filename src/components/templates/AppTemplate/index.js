import React, {useState} from "react";
import UserMenu from '../../menus/UserMenu';
import AppMenu from '../../menus/AppMenu';
import Logo from '../../Logo';
import {BreadcrumbContext, Breadcrumb} from '../../Breadcrumb';
import Layout from '../../Layout';

const AppTemplate = ({ children }) => {

    const [breadcrumb, setBreadcrumb] = useState([]);

    return (
        <Layout drawerMenu={<AppMenu />} toolBarMenu={<UserMenu />} >
            <BreadcrumbContext.Provider value={{setBreadcrumb}}>
                {children}
            </BreadcrumbContext.Provider>
        </Layout>
    )
}

export default AppTemplate;