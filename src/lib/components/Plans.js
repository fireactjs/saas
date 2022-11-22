import React, { useState } from "react";
import { Container, Paper, Grid, Card, CardHeader, CardContent, Typography, CardActions, Button, Box, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { SetPageTitle } from "@fireactjs/core";
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';

const PriceTable = ({setPlan, plans}) => {

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
                            <Button fullWidth variant={plan.popular?"contained":"outlined"} onClick={() => setPlan(plan)}>
                            Continue
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
            </Grid>
        </Box>
    )
}

const PaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements();

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
                    <Button variant="contained">Subscribe</Button>
                </Grid>
            </Stack>
        </Box>
    )
}

export const Plans = () => {

    const [plan, setPlan] = useState(null);

    const plans = [
        {
            title: 'Free',
            popular: false,
            priceId: 'price_1M5hqYDtHLeC8Nf8p5A3qZo1',
            currency: '$',
            price: 0,
            frequency: 'week',
            description: [
                '10 users included',
                '2 GB of storage',
                'Help center access',
                'Email support',
            ]
        },
        {
            title: 'Weekly',
            popular: true,
            priceId: 'price_1M5hsTDtHLeC8Nf8m90FMVNX',
            currency: '$',
            price: 10,
            frequency: 'week',
            description: [
                '20 users included',
                '10 GB of storage',
                'Help center access',
                'Priority email support',
            ]
        },
        {
            title: 'Monthly',
            popular: false,
            priceId: 'price_1M6hVyDtHLeC8Nf8pnaZ0Cb3',
            currency: '$',
            price: 30,
            frequency: 'mo',
            description: [
                '50 users included',
                '30 GB of storage',
                'Help center access',
                'Phone & email support',
            ]
        },
    ];
    
    const stripePublicKey = "pk_test_51Jua08FVa3aiFAReRfDF9A3b50rCusPLSWIBLkGQq78Im9WwoxLBlRXu6wgFUeRtT5VnJJvRo33qskbOIe6Zre3E00sbQNuLXc";

    const stripePromise = loadStripe(stripePublicKey);

    return (
        <Container maxWidth="lg">
            <SetPageTitle title="Choose Plan" />
            <Paper>
                {plan === null && 
                    <PriceTable setPlan={setPlan} plans={plans} />
                }
                {plan !== null && 
                    <Elements stripe={stripePromise}>
                        <PaymentForm />
                    </Elements>
                }
            </Paper>
        </Container>
    )
}
