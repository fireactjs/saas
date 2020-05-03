import React from "react";
import UserProfileView from '../../../../components/user/UserProfileView';
import UserPageLayout from '../../../../components/user/UserPageLayout';

const UserProfile = () => {

    return (
        <UserPageLayout title="Manage Your Profile" >
            <UserProfileView />
        </UserPageLayout>
    )
}

export default UserProfile;