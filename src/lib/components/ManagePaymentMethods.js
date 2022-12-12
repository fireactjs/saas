import { AuthContext, SetPageTitle } from "@fireactjs/core";
import React, { useContext, useEffect, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { getAuth } from "firebase/auth";
import { Alert, Box, Container, Grid, Paper, Typography, Button, Stack } from "@mui/material";
import { PaymentMethodForm } from "./PaymentMethodForm";


export const ManagePaymentMethods = ({loader}) => {
    const { subscription } = useContext(SubscriptionContext);
    const subscriptionName = subscription.name;
    const [loaded, setLoeaded] = useState(false);
    const { firebaseApp } = useContext(AuthContext);
    const auth = getAuth();
    const [ paymentMethods, setPaymentMethods ] = useState([]);
    const [ error, setError ] = useState(null);
    const [ paymentFormDisabled, setPaymentFormDisabled ] = useState(false);
    const [ paymentMethodFormShowed, setPaymentMethodFormShowed ] = useState(false);


    useEffect(() => {
        setLoeaded(false);
        setError(null);
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
            if(paymentMethods.length === 0){
                setPaymentMethodFormShowed(true);
            }
            setPaymentMethods(paymentMethods);
            setLoeaded(true);
        }).catch(err => {
            setError(err.message);
            setLoeaded(true);
        })
    }, [auth.currentUser.uid, firebaseApp]);

    return(
        <>
        {loaded?(
            <Container maxWidth="lx">
                <SetPageTitle title={"Payment Methods"+(subscriptionName!==""?(" - "+subscriptionName):"")} />
                <Paper>
                    <Box p={2}>
                        <Grid container direction="row" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography component="h1" variant="h4">Payment Methods</Typography>
                            </Grid>
                            <Grid item textAlign="right">
                                {!setPaymentMethodFormShowed && 
                                    <Button variant="contained" onClick={() => setPaymentMethodFormShowed(true)}>Add Payment Method</Button>
                                }
                                {setPaymentMethodFormShowed && paymentMethods.length > 0 &&
                                    <Button variant="contained" onClick={() => setPaymentMethodFormShowed(false)}>Back to Payment Methods</Button>
                                }
                            </Grid>
                        </Grid>
                    </Box>
                    <Box p={2}>
                        {error !== null?(
                            <Alert severity="error">{error}</Alert>
                        ):(
                            <>
                                {setPaymentMethodFormShowed?(
                                    <Grid item >
                                        <Box p={5}>
                                            <Stack spacing={3}>
                                                <Typography
                                                component="h1"
                                                variant="h5"
                                                align="center"
                                                color="text.primary"
                                                gutterBottom
                                                mb={8}
                                                >
                                                Add Payment Method
                                                </Typography>
                                            </Stack>
                                            <PaymentMethodForm setPaymentMethod={(pm) => {
                                                setPaymentFormDisabled(true);
                                                // attach the payment method to a subscription via cloud function
                                                console.log(pm);
                                            }} buttonText="Add Payment Method" disabled={paymentFormDisabled} />
                                        </Box>
                                    </Grid>
                                ):(
                                    <></>
                                )}
                            </>
                        )}
                    </Box>
                </Paper>
            </Container>
        ):(
            <>{loader}</>
        )}
        </>
    )
}