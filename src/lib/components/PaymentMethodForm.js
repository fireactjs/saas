import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import React, { useContext, useMemo, useState } from "react";
import { FireactContext } from '@fireactjs/core';
import { Grid, Stack, Alert, Box, Button } from '@mui/material';

const PaymentMethodFormHandler = ({setPaymentMethod, buttonText, disabled}) => {
    const [ processing, setProcessing ] = useState(false);
    const [ error, setError ] = useState(null);
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

    const getPaymentMethod = async(event) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);
        if(!stripe || !elements){
            setProcessing(false);
            return;
        }
        const cardElement = elements.getElement(CardElement);
        var data = {
            type: 'card',
            card: cardElement
        }
        const {error, paymentMethod} = await stripe.createPaymentMethod(data);
        if(error){
            setError(error.message);
            setProcessing(false);
        }else{
            setPaymentMethod(paymentMethod);
            setProcessing(false);
        }
    }


    return (
        <Stack spacing={3}>
            <Grid container direction="row" justifyContent="center" alignItems="center">
                <Grid item md={8}>
                    {error && 
                        <Box mb={2}>
                            <Alert severity="error">{error}</Alert>
                        </Box>
                    }

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
                <Button variant="contained" disabled={processing || disabled} onClick={e => getPaymentMethod(e)}>{buttonText}</Button>
            </Grid>
        </Stack>
    )
}

export const PaymentMethodForm = ({setPaymentMethod, buttonText, disabled, billingDetails}) => {
    const {config} = useContext(FireactContext);
    const stripePromise = useMemo(() => {return loadStripe(config.saas.stripe.public_api_key)}, [config.saas.stripe.public_api_key]);

    return (
        <Elements stripe={stripePromise}>
            <PaymentMethodFormHandler setPaymentMethod={setPaymentMethod} buttonText={buttonText} disabled={disabled} billingDetails={billingDetails}/>
        </Elements>
    )

}