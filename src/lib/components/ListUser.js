import React, { useContext, useEffect, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import "firebase/compat/functions";
import { AuthContext } from "@fireactjs/core";

export const ListUser = ({loader}) => {
    const { subscription } = useContext(SubscriptionContext);
    const [ users, setUsers ] = useState([]);

    const { firebaseApp } = useContext(AuthContext);
    const CloudFunctions = firebaseApp.functions();

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const getSubscriptionUsers = CloudFunctions.httpsCallable('fireactjsSaas-getSubscriptionUsers');
        getSubscriptionUsers({subscriptionId: subscription.id}).then(result => {
            console.log(result);
            setUsers(result.result.users);
            setLoaded(true);
        }).catch(error => {
            setLoaded(true);
        });
    }, [subscription.id]);


    return (
        <>
            {loaded?(
                <></>
            ):(
                <>{loader}</>
            )}
        </>
    )
}