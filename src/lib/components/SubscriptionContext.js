import React, { useContext, useEffect, useState } from "react";
import { useParams, Outlet } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext, FireactContext } from "@fireactjs/core";
import { Alert, Box, Container } from "@mui/material";

export const SubscriptionContext = React.createContext();

export const SubscriptionProvider = ({loader}) => {
    const { subscriptionId } = useParams();
    const [ subscription, setSubscription ] = useState(null);
    const { firestoreInstance } = useContext(AuthContext);
    const [ error, setError ] = useState(null);
    const { config } = useContext(FireactContext);

    useEffect(() => {
        setError(null);
        const docRef = doc(firestoreInstance, "subscriptions", subscriptionId);

        getDoc(docRef).then(docSnap => {
            if(docSnap.exists()){
                const sub = docSnap.data();
                sub.id = subscriptionId;
                setSubscription(sub);
            }else{
                // no subscription
                setError("No "+config.saas.subscription.singular+" matches the ID");
            }
        }).catch(error => {
            setError(error.message);
        })
    }, [subscriptionId, firestoreInstance, config.saas.subscription.singular, setError]);

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
                        <SubscriptionContext.Provider value={{subscription, setSubscription}}>
                            <Outlet />
                        </SubscriptionContext.Provider>
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