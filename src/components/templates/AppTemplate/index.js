import React from "react";
import UserMenu from '../../menus/UserMenu';
import AppMenu from '../../menus/AppMenu';
import Layout from '../../Layout';

const AppTemplate = ({ children }) => {

    return (
        <Layout drawerMenu={<AppMenu />} toolBarMenu={<UserMenu />} >
            {children}
        </Layout>
    )
}

export default AppTemplate;