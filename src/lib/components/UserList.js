import React, { useContext, useEffect, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import "firebase/compat/functions";
import { AuthContext } from "@fireactjs/core";

export const UserList = ({loader}) => {
    const { subscription } = useContext(SubscriptionContext);
    const [ users, setUsers ] = useState([]);

    const { firebaseApp } = useContext(AuthContext);
    const CloudFunctions = firebaseApp.functions();

    useEffect(() => {
        const getSubscriptionUsers = CloudFunctions.httpsCallable('fireactjsSaas-getSubscriptionUsers');
        getSubscriptionUsers({subscriptionId: subscription.id}).then(result => {
            console.log(result);
        }).catch(error => {

        });
    }, [subscription.id]);


    return (
        <></>
    )
}