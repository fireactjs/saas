import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Alert, Box, Container, Paper, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { PricingPlans } from "./PricingPlans";
import { SubscriptionContext } from "./SubscriptionContext";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { httpsCallable } from "firebase/functions";
import { NavLink } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { BillingDetails } from "./BillingDetails";

export const ChangePlan = () => {

    const { subscription, setSubscription } = useContext(SubscriptionContext);
    const { config } = useContext(FireactContext);

    const { firestoreInstance, functionsInstance, authInstance } = useContext(AuthContext);

    const [ processing, setProcessing ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ showPaymentMethod, setShowPaymentMethod ] = useState(false);
    const [ selectedPlan, setSelectedPlan ] = useState(null);
    const [ success, setSuccess ] = useState(false);

    const [ billingDetails, setBillingDetails ] = useState(null);
    const [ paymentStep, setPaymentStep ] = useState(1);

    const selectPlan = (plan) => {
        setProcessing(true);
        setError(null);
        if(plan.free || subscription.paymentMethod){
            // subscribe to the new plan
            const changeSubscriptionPlan = httpsCallable(functionsInstance, 'fireactjsSaas-changeSubscriptionPlan');
            changeSubscriptionPlan({
                paymentMethodId: subscription.paymentMethod,
                billingDetails: null,
                planId: plan.id,
                subscriptionId: subscription.id
            }).then(() => {
                setSubscription(prevState => ({
                    ...prevState,
                    plan: plan.title, // title of the plan
                    planId: plan.id, // price ID in stripe
                    paymentCycle: plan.frequency,
                    price: plan.price,
                    currency: plan.currency
                }));
                setSuccess(true);
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
        const changeSubscriptionPlan = httpsCallable(functionsInstance, 'fireactjsSaas-changeSubscriptionPlan');
        changeSubscriptionPlan({
            paymentMethodId: paymentMethod.id,
            billingDetails: billingDetails,
            planId: selectedPlan.id,
            subscriptionId: subscription.id
        }).then(() => {
            const pmRef = doc(firestoreInstance, 'users/'+authInstance.currentUser.uid+'/paymentMethods/'+paymentMethod.id);
            return setDoc(pmRef,{
                type: paymentMethod.type,
                cardBrand: paymentMethod.card.brand,
                cardExpMonth: paymentMethod.card.exp_month,
                cardExpYear: paymentMethod.card.exp_year,
                cardLast4: paymentMethod.card.last4
            },{merge:true});
        }).then(() => {
            setSubscription(prevState => ({
                ...prevState,
                plan: selectedPlan.title, // title of the plan
                planId: selectedPlan.id, // price ID in stripe
                paymentCycle: selectedPlan.frequency,
                price: selectedPlan.price,
                currency: selectedPlan.currency,
                paymentMethod: paymentMethod.id
            }));
            setSuccess(true);
            setProcessing(false);
        }).catch(err => {
            setError(err.message);
            setProcessing(false);
        });
    }

    return (
        <Container maxWidth="lg">
            <SetPageTitle title={"Change Plan"+((subscription.name!=="" && typeof(subscription.name) !== 'undefined')?(" - "+subscription.name):"")} />
            {success?(
                <Alert severity="success">Your subscription plan has been changed. Please go back to <NavLink to={config.pathnames.ListInvoices.replace(":subscriptionId", subscription.id)}>Billing</NavLink>.</Alert>
            ):(
                <Paper>
                    <Box p={5}>
                        {showPaymentMethod?(
                            <Stack spacing={3}>
                                { paymentStep === 1 && 
                                    <>
                                        <Typography
                                        component="h1"
                                        variant="h3"
                                        align="center"
                                        color="text.primary"
                                        gutterBottom
                                        >
                                        Your Billing Details
                                        </Typography>
                                        {error !== null && 
                                            <Alert severity="error">{error}</Alert>
                                        }
                                        <BillingDetails buttonText={"Continue"} setBillingDetailsObject={(obj) => {
                                                setBillingDetails(obj);
                                                setPaymentStep(2);
                                            }
                                        } />
                                    </>
                                }
                                { paymentStep === 2 && 
                                    <>
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
                                        <PaymentMethodForm buttonText={"Subscribe"} setPaymentMethod={submitPlan} disabled={processing} />
                                    </>
                                    
                                }              
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
                                    <PricingPlans selectedPlanId={subscription.planId} selectPlan={selectPlan} disabled={processing} paymentMethod={subscription.paymentMethod} />
                                </div>
                            </Stack>
                        )}
                    </Box>
                </Paper>
            )}
            
        </Container>
    )
}