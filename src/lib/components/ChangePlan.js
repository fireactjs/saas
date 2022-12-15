import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Alert, Box, Container, Paper, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { PricingPlans } from "./PricingPlans";
import { SubscriptionContext } from "./SubscriptionContext";
import "firebase/compat/functions";
import { PaymentMethodForm } from "./PaymentMethodForm";

export const ChangePlan = () => {

    const { subscription, setSubscription } = useContext(SubscriptionContext);
    const { config } = useContext(FireactContext);

    const { firebaseApp } = useContext(AuthContext);
    const CloudFunctions = firebaseApp.functions();

    const [ processing, setProcessing ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ showPaymentMethod, setShowPaymentMethod ] = useState(false);
    const [ selectedPlan, setSelectedPlan ] = useState(null);

    const selectPlan = (plan) => {
        setProcessing(true);
        setError(null);
        if(plan.price === 0 || subscription.paymentMethod){
            // subscribe to the new plan
            const changeSubscriptionPlan = CloudFunctions.httpsCallable('fireactjsSaas-changeSubscriptionPlan');
            changeSubscriptionPlan({
                paymentMethodId: subscription.paymentMethod,
                priceId: plan.priceId,
                subscriptionId: subscription.id
            }).then(() => {
                setProcessing(false);
            }).catch(err => {
                setError(err.message);
                setProcessing(false);
            });
        }else{
            // show payment method
            setSelectedPlan(plan);
            setShowPaymentMethod(true);
            setProcessing(false);
        }
    }

    const submitPlan = (paymentMethod) => {
        setProcessing(true);
        setError(null);
        const changeSubscriptionPlan = CloudFunctions.httpsCallable('fireactjsSaas-changeSubscriptionPlan');
        changeSubscriptionPlan({
            paymentMethodId: paymentMethod.id,
            priceId: selectedPlan.priceId,
            subscriptionId: subscription.id
        }).then(() => {
            setSubscription(prevState => ({
                ...prevState,
                plan: selectedPlan.title, // title of the plan
                stripePriceId: selectedPlan.priceId, // price ID in stripe
                paymentCycle: selectedPlan.frequency,
                price: selectedPlan.price,
                currency: selectedPlan.currency,
                paymentMethod: paymentMethod.id
            }))
            setProcessing(false);
        }).catch(err => {
            setError(err.message);
            setProcessing(false);
        });
    }

    return (
        <Container maxWidth="lx">
            <SetPageTitle title={"Change Plan"+(subscription.name!==""?(" - "+subscription.name):"")} />
            <Paper>
                <Box p={5}>
                    {showPaymentMethod?(
                        <Stack spacing={3}>
                            <Typography
                            component="h1"
                            variant="h3"
                            align="center"
                            color="text.primary"
                            gutterBottom
                            >
                            Setup Payment Method
                            </Typography>
                            {error !== null && 
                                <Alert severity="error">{error}</Alert>
                            }
                            <PaymentMethodForm buttonText={"Submit"} setPaymentMethod={submitPlan} disabled={processing} />               
                        </Stack>
                    ):(
                        <Stack spacing={3}>
                            <Typography
                            component="h1"
                            variant="h3"
                            align="center"
                            color="text.primary"
                            gutterBottom
                            >
                            Choose a Plan
                            </Typography>
                            {error !== null && 
                                <Alert severity="error">{error}</Alert>
                            }
                            <div>
                                <PricingPlans selectedPriceId={subscription.stripePriceId} selectPlan={selectPlan} disabled={processing} />
                            </div>
                        </Stack>
                    )}
                </Box>
                
            </Paper>
            
        </Container>
    )
}