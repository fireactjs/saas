import React from "react";
import UserProfileView from './UserProfileView';
import UserPageLayout from './UserPageLayout';

const UserProfile = () => {

    return (
        <UserPageLayout title="Manage Your Profile" >
            <UserProfileView />
        </UserPageLayout>
    )
}

export default UserProfile;