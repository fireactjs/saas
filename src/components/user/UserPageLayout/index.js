import React from "react";
import Breadcrumb from '../../Breadcrumb';

const UserPageLayout = (props) => {
    const {
        title,
        children
    } = props

    const breadcrumbLinks = [
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
    ];

    return (
        <>
            <Breadcrumb links={breadcrumbLinks} />
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