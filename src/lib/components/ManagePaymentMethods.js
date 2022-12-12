import { AuthContext, SetPageTitle } from "@fireactjs/core";
import React, { useContext, useEffect, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { getAuth } from "firebase/auth";
import { Container } from "@mui/material";


export const ManagePaymentMethods = ({loader}) => {
    const { subscription } = useContext(SubscriptionContext);
    const subscriptionName = subscription.name;
    const [loaded, setLoeaded] = useState(false);
    const { firebaseApp } = useContext(AuthContext);
    const auth = getAuth();
    const [ paymentMethods, setPaymentMethods ] = useState([]);



    useEffect(() => {
        setLoeaded(false);
        // load payment methods of the user
        const paymentMethodsRef = firebaseApp.firestore().collection('users/'+auth.currentUser.uid+'/paymentMethods');
        paymentMethodsRef.get().then(paymentMethodsSnapshot => {
            const paymentMethods = [];
            paymentMethodsSnapshot.forEach(paymentMethod => {
                paymentMethods.push({
                    id: paymentMethod.id,
                    type: paymentMethod.type,
                    card: {
                        brand: paymentMethod.cardBrand,
                        expMonth: paymentMethod.cardExpMonth,
                        expYear: paymentMethod.cardExpYear,
                        last4: paymentMethod.cardLast4
                    }
                });
            });
            setPaymentMethods(paymentMethods);
            setLoeaded(true);
        }).catch(err => {
            setLoeaded(true);
        })
    }, [auth.currentUser.uid, firebaseApp]);

    return(
        <>
        {loaded?(
            <Container maxWidth="lx">
                <SetPageTitle title={"Payment Methods"+(subscriptionName!==""?(" - "+subscriptionName):"")} />
            </Container>
        ):(
            <>{loader}</>
        )}
        </>
    )
}