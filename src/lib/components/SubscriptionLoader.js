import React, { useContext, useEffect, useState } from "react";
import { useParams, Outlet } from 'react-router-dom';
import { doc, getFirestore, getDoc } from 'firebase/firestore';
import { AuthContext, FireactContext } from "@fireactjs/core";
import { Alert, Box, Container } from "@mui/material";

export const SubscriptionLoader = ({loader}) => {
    const { subscriptionId } = useParams();
    const [ subscription, setSubscriptions ] = useState(null);
    const { firebaseApp } = useContext(AuthContext);
    const [ error, setError ] = useState(null);
    const { config } = useContext(FireactContext);

    useEffect(() => {
        setError(null);
        const db = getFirestore(firebaseApp);
        const docRef = doc(db, "subscriptions", subscriptionId);

        getDoc(docRef).then(docSnap => {
            if(docSnap.exists()){
                setSubscriptions(docSnap.data());
            }else{
                // no subscription
                setError("No "+config.saas.subscription.singular+" matches the ID");
            }
        }).catch(error => {
            setError(error.message);
        })
    }, [subscriptionId, firebaseApp, config.saas.subscription.singular, setError]);

    return (
        <>
            {error !== null?(
                <Box mt={10}>
                <Container maxWidth="sm">
                    <Box component="span" m={5} textAlign="center">
                        <Alert severity="error" >{error}</Alert>
                    </Box>
                </Container>
            </Box>
            ):(
                <>
                    {subscription !== null?(
                        <Outlet />
                    ):(
                        <Box mt={10}>
                            <Container maxWidth="sm">
                                <Box component="span" m={5} textAlign="center">
                                    {loader}
                                </Box>
                            </Container>
                        </Box>
                    )}
                </>
            )}
            
        </>
    )

}