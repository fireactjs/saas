import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Alert, Box, Container, Paper, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { PricingPlans } from "./PricingPlans";
import { httpsCallable } from "firebase/functions";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const CreateSubscription = () => {

    const { config } = useContext(FireactContext);

    const { firestoreInstance, functionsInstance } = useContext(AuthContext);

    const [ processing, setProcessing ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ showPaymentMethod, setShowPaymentMethod ] = useState(false);
    const [ selectedPlan, setSelectedPlan ] = useState(null);
    const singular = config.saas.subscription.singular;
    const auth = getAuth();
    const navigate = useNavigate();

    const selectPlan = (plan) => {
        setProcessing(true);
        setError(null);
        if(plan.price === 0){
            const createSubscription = httpsCallable(functionsInstance, 'fireactjsSaas-createSubscription');
            createSubscription({
                priceId: plan.priceId,
                paymentMethodId: null
            }).then((res) => {
                if(res.data && res.data.subscriptionId){
                    navigate(config.pathnames.Settings.replace(":subscriptionId", res.data.subscriptionId));
                }else{
                    setError("Failed to create the "+singular+".");
                    setProcessing(false);                    
                }
            }).catch(error => {
                setError(error.message);
                setProcessing(false);
            })
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
        const createSubscription = httpsCallable(functionsInstance, 'fireactjsSaas-createSubscription');
        let subscriptionId = null;
        createSubscription({
            paymentMethodId: paymentMethod.id,
            priceId: selectedPlan.priceId
        }).then((res) => {
            if(res.data && res.data.subscriptionId){
                subscriptionId = res.data.subscriptionId;
            }
            const pmRef = doc(firestoreInstance, 'users/'+auth.currentUser.uid+'/paymentMethods/'+paymentMethod.id);
            return setDoc(pmRef, {
                type: paymentMethod.type,
                cardBrand: paymentMethod.card.brand,
                cardExpMonth: paymentMethod.card.exp_month,
                cardExpYear: paymentMethod.card.exp_year,
                cardLast4: paymentMethod.card.last4
            },{merge:true});
        }).then(() => {
            if(subscriptionId !== null){
                navigate(config.pathnames.Settings.replace(":subscriptionId", subscriptionId));
            }else{
                setError("Failed to create the "+singular+".");
                setProcessing(false);                    
            }
        }).catch(err => {
            setError(err.message);
            setProcessing(false);
        });
    }

    return (
        <Container maxWidth="lg">
            <SetPageTitle title={"Choose a Plan"} />
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
                                <PricingPlans selectPlan={selectPlan} disabled={processing} />
                            </div>
                        </Stack>
                    )}
                </Box>
            </Paper>
        </Container>
    )
}