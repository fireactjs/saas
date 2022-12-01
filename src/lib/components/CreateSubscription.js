import React, { useContext, useState } from "react";
import { Container, Paper, Grid, Card, CardHeader, CardContent, Typography, CardActions, Button, Box, Stack, Alert } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { useNavigate } from "react-router-dom";
import "firebase/compat/functions";

const PriceTable = ({setPlan, plans}) => {

    const { firebaseApp } = useContext(AuthContext);
    const CloudFunctions = firebaseApp.functions();

    const [ processing, setProcessing ] = useState(false);
    const [ error, setError ] = useState(null);

    const navigate = useNavigate();
    const {config} = useContext(FireactContext);
    const singular = config.saas.subscription.singular;

    const subscribe = async(event, plan) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);

        if(plan.price === 0){
            const createSubscription = CloudFunctions.httpsCallable('fireactjsSaas-createSubscription');
            createSubscription({
                priceId: plan.priceId,
                paymentMethodId: null
            }).then((res) => {
                if(res.data && res.data.subcriptionId){
                    navigate(config.pathnames.Settings.replace(":subscriptionId", res.result.subcriptionId));
                }else{
                    setError("Failed to create the "+singular+".");
                    setProcessing(false);                    
                }
            }).catch(error => {
                setError(error.message);
                setProcessing(false);
            })
        }

    }

    return (
        <Box p={5}>
            <Typography
            component="h1"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
            mb={8}
            >
            Choose Your Plan
            </Typography>
            {error && 
                <Box mb={2}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            }
            <Grid container spacing={5} alignItems="flex-end">
            {plans.map((plan) => (
                // Enterprise card is full width at sm breakpoint
                <Grid
                item
                key={plan.title}
                xs={12}
                sm={plan.title === 'Enterprise' ? 12 : 6}
                md={4}
                >
                    <Card>
                        <CardHeader
                        title={plan.title}
                        subheader={plan.popular ? "Most Popular": ""}
                        titleTypographyProps={{ align: 'center' }}
                        action={plan.popular ? <StarIcon color="success" /> : null}
                        subheaderTypographyProps={{
                        align: 'center',
                        }}
                        sx={{
                        backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                        }}
                        />
                        <CardContent>
                            <Box
                            sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'baseline',
                            mb: 2,
                            }}
                            >
                                <Typography variant="h4" color="text.primary">
                                {plan.currency}
                                </Typography>
                                <Typography component="h2" variant="h3" color="text.primary">
                                {plan.price}
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                /{plan.frequency}
                                </Typography>
                            </Box>
                            <ul style={{listStyleType: 'none', paddingLeft: '0px'}}>
                            {plan.description.map((line) => (
                                <Typography
                                component="li"
                                variant="subtitle1"
                                align="center"
                                key={line}
                                >
                                    {line}
                                </Typography>
                            ))}
                            </ul>
                        </CardContent>
                        <CardActions>
                            <Button fullWidth disabled={processing} variant={plan.popular?"contained":"outlined"} onClick={(e) => {
                                if(plan.price === 0){
                                    subscribe(e, plan);
                                }else{
                                    setPlan(plan);
                                }
                            }}>
                            {plan.price === 0?"Subscribe":"Continue"}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
            </Grid>
        </Box>
    )
}

const PaymentForm = ({plan}) => {

    const stripe = useStripe();
    const elements = useElements();
    const { firebaseApp } = useContext(AuthContext);
    const CloudFunctions = firebaseApp.functions();

    const [ processing, setProcessing ] = useState(false);
    const [ error, setError ] = useState(null);

    const navigate = useNavigate();
    const {config} = useContext(FireactContext);
    const singular = config.saas.subscription.singular;

    const subscribe = async(event) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);

        if(plan.price > 0){
            if(!stripe || !elements){
                return;
            }
            const cardElement = elements.getElement(CardElement);
            const {error, paymentMethod} = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement
            });

            if(error){

            }else{
                const createSubscription = CloudFunctions.httpsCallable('fireactjsSaas-createSubscription');
                createSubscription({
                    priceId: plan.priceId,
                    paymentMethodId: paymentMethod.id
                }).then(res => {
                    if(res.data && res.data.subcriptionId){
                        navigate(config.pathnames.Settings.replace(":subscriptionId", res.result.subcriptionId));
                    }else{
                        setError("Failed to create the "+singular+".");
                        setProcessing(false);                    
                    }
                }).catch(error => {
                    setError(error.message);
                    setProcessing(false);                    
                })
            }
        }

    }

    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
              color: '#32325d',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
            }
        },
        hidePostalCode: true
    };

    return (
        <Box p={5}>
            <Stack spacing={3}>
                <Typography
                component="h1"
                variant="h3"
                align="center"
                color="text.primary"
                gutterBottom
                mb={8}
                >
                Payment Method
                </Typography>
                {error && 
                    <Box mb={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                }
                <Grid container direction="row" justifyContent="center" alignItems="center">
                    <Grid item md={8}>
                        <div style={{position: "relative", minHeight: '56px', padding: '15px'}}>
                            <CardElement options={CARD_ELEMENT_OPTIONS}></CardElement>
                            <fieldset style={{
                                borderColor: 'rgba(0, 0, 0, 0.23)',
                                borderStyle: 'solid',
                                borderWidth: '1px',
                                borderRadius: '4px',
                                position: 'absolute',
                                top: '-5px',
                                left: '0',
                                right: '0',
                                bottom: '0',
                                margin: '0',
                                padding: '0 8px',
                                overflow: 'hidden',
                                pointerEvents: 'none'
                                
                            }}></fieldset>
                        </div>
                    </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="center" alignItems="center">
                    <Button variant="contained" disabled={processing} onClick={e => subscribe(e)}>Subscribe</Button>
                </Grid>
            </Stack>
        </Box>
    )
}

export const CreateSubscription = () => {

    const {config} = useContext(FireactContext);
    const [plan, setPlan] = useState(null);

    const stripePromise = loadStripe(config.saas.stripe.public_api_key);

    const singular = config.saas.subscription.singular;

    return (
        <Container maxWidth="lg">
            <SetPageTitle title={`Create ${singular}`} />
            <Paper>
                {plan === null && 
                    <PriceTable setPlan={setPlan} plans={config.saas.plans} />
                }
                {plan !== null && 
                    <Elements stripe={stripePromise}>
                        <PaymentForm plan={plan} />
                    </Elements>
                }
            </Paper>
        </Container>
    )
}
