import React, {useContext, useEffect} from "react";
import {BreadcrumbContext} from '../../Breadcrumb';

const UserPageLayout = (props) => {
    const {
        title,
        children
    } = props

    const { setBreadcrumb } = useContext(BreadcrumbContext);
    useEffect(() => {
        setBreadcrumb([
            {
                to: "/",
                text: "Home",
                active: false
            },
            {
                to: "/user/profile",
                text: "User",
                active: false
            },
            {
                to: null,
                text: title,
                active: true
            }
        ]);
    },[setBreadcrumb, title]);
    
    
    

    return (
        <>
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="card">
                        <div className="card-header">
                            {title}
                        </div>
                        <div className="card-body">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserPageLayout;