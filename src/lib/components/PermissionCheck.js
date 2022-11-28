import React, { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { doc, getFirestore, getDoc } from 'firebase/firestore';
import { AuthContext } from "@fireactjs/core";

export const PermissionCheck = ({permissions, errorMessage}) => {

    const { subscriptionId } = useParams();
    const [ subscription, setSubscriptions ] = useState(null);
    const { firebaseApp } = useContext(AuthContext);

    useEffect(() => {
        console.log('useeffect');
        const db = getFirestore(firebaseApp);
        const docRef = doc(db, "subscriptions", subscriptionId);
        console.log(docRef);
        getDoc(docRef).then(docSnap => {
            console.log(docSnap);
            if(docSnap.exists()){
                console.log(docSnap.data());
                setSubscriptions(docSnap.data());
            }else{
                // no subscription
                console.log("no sub")
            }
        }).catch(error => {
            console.log(error.message);
        })
    }, [subscriptionId, firebaseApp]);

    return (
        <div>
            {subscription.name}
        </div>
    )
}