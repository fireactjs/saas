import { AuthContext, SetPageTitle } from "@fireactjs/core";
import React, { useContext, useEffect, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { getAuth } from "firebase/auth";
import { Alert, Box, Container, Grid, Paper, Typography, Button, Stack, Card, CardHeader, CardActions, Chip } from "@mui/material";
import { PaymentMethodForm } from "./PaymentMethodForm";
import "firebase/compat/functions";


export const ManagePaymentMethods = ({loader}) => {
    const { subscription, setSubscription } = useContext(SubscriptionContext);
    const subscriptionName = subscription.name;
    const [loaded, setLoeaded] = useState(false);
    const { firebaseApp } = useContext(AuthContext);
    const auth = getAuth();
    const [ paymentMethods, setPaymentMethods ] = useState([]);
    const [ error, setError ] = useState(null);
    const [ paymentFormDisabled, setPaymentFormDisabled ] = useState(false);
    const [ paymentMethodFormShowed, setPaymentMethodFormShowed ] = useState(false);
    const CloudFunctions = firebaseApp.functions();
    const [ processing, setProcessing ] = useState(false);


    useEffect(() => {
        setLoeaded(false);
        setError(null);
        setPaymentMethodFormShowed(false);
        // load payment methods of the user
        const paymentMethodsRef = firebaseApp.firestore().collection('users/'+auth.currentUser.uid+'/paymentMethods');
        paymentMethodsRef.get().then(paymentMethodsSnapshot => {
            const paymentMethods = [];
            paymentMethodsSnapshot.forEach(paymentMethod => {
                paymentMethods.push({
                    id: paymentMethod.id,
                    type: paymentMethod.data().type,
                    cardBrand: paymentMethod.data().cardBrand,
                    cardExpMonth: paymentMethod.data().cardExpMonth,
                    cardExpYear: paymentMethod.data().cardExpYear,
                    cardLast4: paymentMethod.data().cardLast4
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
                                {!paymentMethodFormShowed && 
                                    <Button variant="contained" onClick={() => setPaymentMethodFormShowed(true)}>Add Payment Method</Button>
                                }
                                {paymentMethodFormShowed && paymentMethods.length > 0 &&
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
                                {paymentMethodFormShowed?(
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
                                                setError(null);
                                                setPaymentFormDisabled(true);
                                                // write payment method to user
                                                const pmRef = firebaseApp.firestore().doc('users/'+auth.currentUser.uid+'/paymentMethods/'+pm.id);
                                                pmRef.set({
                                                    type: pm.type,
                                                    cardBrand: pm.card.brand,
                                                    cardExpMonth: pm.card.exp_month,
                                                    cardExpYear: pm.card.exp_year,
                                                    cardLast4: pm.card.last4
                                                },{merge:true}).then(() => {
                                                    // attach the payment method to a subscription via cloud function
                                                    const updateSubscriptionPaymentMethod = CloudFunctions.httpsCallable('fireactjsSaas-updateSubscriptionPaymentMethod');
                                                    return updateSubscriptionPaymentMethod({
                                                        subscriptionId: subscription.id,
                                                        paymentMethodId: pm.id
                                                    })
                                                }).then(() => {
                                                    // update subscription default payment
                                                    setSubscription(prevState => ({
                                                        ...prevState,
                                                        paymentMethod: pm.id
                                                    }));
                                                    // add payment method to state
                                                    setPaymentMethods(prevState => {prevState.push({
                                                        id: pm.id,
                                                        type: pm.type,
                                                        cardBrand: pm.card.brand,
                                                        cardExpMonth: pm.card.exp_month,
                                                        cardExpYear: pm.card.exp_year,
                                                        cardLast4: pm.card.last4
                                                        });
                                                        return prevState;
                                                    });
                                                    setPaymentFormDisabled(false);
                                                    setPaymentMethodFormShowed(false);
                                                }).catch(err =>{
                                                    setPaymentFormDisabled(false);
                                                    setError(err.message);
                                                })
                                            }} buttonText="Add Payment Method" disabled={paymentFormDisabled} />
                                        </Box>
                                    </Grid>
                                ):(
                                    <Grid container spacing={3}>
                                        {paymentMethods.map((paymentMethod, i) => 
                                            <Grid item xs={12} md={4} key={i}>
                                                <Card>
                                                    <CardHeader title={
                                                        <Stack direction="row" spacing={2} alignItems="center">
                                                            <Typography component="h3" variant="h4">
                                                                {paymentMethod.cardBrand}
                                                            </Typography>
                                                            {subscription.paymentMethod === paymentMethod.id &&
                                                                <Chip label="active" color="success" size="small" />
                                                            }

                                                        </Stack>
                                                    } subheader={
                                                        <Grid container>
                                                            <Grid item xs>**** **** **** {paymentMethod.cardLast4}</Grid>
                                                            <Grid item>{paymentMethod.cardExpMonth} / {paymentMethod.cardExpYear}</Grid>
                                                        </Grid>
                                                    } />
                                                    <CardActions>
                                                        <Button variant="outlined" color="success" disabled={subscription.paymentMethod === paymentMethod.id || processing} onClick={() => {
                                                            setProcessing(true);
                                                            setError(null);
                                                            const updateSubscriptionPaymentMethod = CloudFunctions.httpsCallable('fireactjsSaas-updateSubscriptionPaymentMethod');
                                                            return updateSubscriptionPaymentMethod({
                                                                subscriptionId: subscription.id,
                                                                paymentMethodId: paymentMethod.id
                                                            }).then(() => {
                                                                // update subscription default payment
                                                                setSubscription(prevState => ({
                                                                    ...prevState,
                                                                    paymentMethod: paymentMethod.id
                                                                }));
                                                                setProcessing(false);
                                                            }).catch(err =>{
                                                                setError(err.message);
                                                                setProcessing(false);
                                                            });
                                                        }}>Set Default</Button>
                                                        <Button variant="outlined" color="error" disabled={subscription.paymentMethod === paymentMethod.id || processing} onClick={() => {
                                                            setProcessing(true);
                                                            setError(null);
                                                            const removePaymentMethod = CloudFunctions.httpsCallable('fireactjsSaas-removePaymentMethod');
                                                            return removePaymentMethod({
                                                                paymentMethodId: paymentMethod.id
                                                            }).then(() => {
                                                                setPaymentMethods(prevState => prevState.filter(row => {
                                                                    return row.id !== paymentMethod.id
                                                                }));
                                                                setProcessing(false);
                                                            }).catch(err =>{
                                                                setError(err.message);
                                                                setProcessing(false);
                                                            });
                                                        }}>Remove</Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        )}
                                    </Grid>
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