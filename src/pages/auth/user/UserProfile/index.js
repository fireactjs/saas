import React from "react";
import Breadcrumb from '../../../../components/Breadcrumb';
import UserProfileView from './UserProfileView';

const UserProfile = () => {
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
            text: "Profile",
            active: true
        }
    ];

    return (
        <>
            <Breadcrumb links={breadcrumbLinks} />
            <div className="container-fluid">
                <div className="animated fadeIn">
                   <UserProfileView />
                </div>
            </div>
        </>

    )
}

export default UserProfile;