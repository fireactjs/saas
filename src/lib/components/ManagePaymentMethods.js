import { AuthContext, SetPageTitle } from "@fireactjs/core";
import React, { useContext, useEffect, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { getAuth } from "firebase/auth";
import { Alert, Box, Container, Grid, Paper, Typography, Button, Stack, Card, CardHeader, CardActions } from "@mui/material";
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
            console.log(paymentMethods);
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

                                                })
                                            }} buttonText="Add Payment Method" disabled={paymentFormDisabled} />
                                        </Box>
                                    </Grid>
                                ):(
                                    <Grid container spacing={3}>
                                        {paymentMethods.map((paymentMethod, i) => 
                                            <Grid item xs={12} md={4} key={i}>
                                            <Card>
                                                <CardHeader title={paymentMethod.cardBrand} subheader={
                                                    <Grid container>
                                                        <Grid item xs>---- ---- ---- {paymentMethod.cardLast4}</Grid>
                                                        <Grid item>{paymentMethod.cardExpMonth} / {paymentMethod.cardExpYear}</Grid>
                                                    </Grid>
                                                } />
                                                <CardActions>
                                                    <Button variant="outlined" color="success" disabled={subscription.paymentMethod === paymentMethod.id} onClick={() => {}}>Set Default</Button>
                                                    <Button variant="outlined" color="error" disabled={subscription.paymentMethod === paymentMethod.id} onClick={() => {}}>Remove</Button>
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