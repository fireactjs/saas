import React, { useContext } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { getAuth } from "firebase/auth";
import { checkPermission } from "./utilities";
import { Outlet } from 'react-router-dom';
import { Alert } from "@mui/material";

export const PermissionRouter = ({permissions}) => {
    const { subscription } = useContext(SubscriptionContext);
    const auth = getAuth();

    return (
        <>
            {checkPermission(subscription, auth.currentUser.uid, permissions)?(
                <Outlet />
            ):(
                <Alert severity="error">No premission to access.</Alert>
            )}
        </>
    )
}