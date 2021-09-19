import React, {useState, useContext, useEffect, useRef} from "react";
import { useHistory } from 'react-router-dom';
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import { AuthContext } from "../../../../components/FirebaseAuth";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import Loader from '../../../../components/Loader';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Paper, Box, Alert, Stack, Button } from "@mui/material";

const PaymentMethod = () => {
    const title = 'Update Payment Method';
    const mountedRef = useRef(true);
    const history = useHistory();

    const { userData, authUser } = useContext(AuthContext);
    const stripe = useStripe();
    const elements = useElements();
    const { setBreadcrumb } = useContext(BreadcrumbContext);

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

    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cardError, setCardError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const subscribe = async(event) => {
        event.preventDefault();
        setProcessing(true);
        setErrorMessage(null);
        setSuccess(false);

        let hasError = false;
        let paymentMethodId = '';

        setCardError(null);

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        // Use your card Element with other Stripe.js APIs
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setCardError(error.message);
            hasError = true;
        } else {
            paymentMethodId = paymentMethod.id;
        }

        
        if(!hasError){
            const updatePaymentMethod = CloudFunctions.httpsCallable('updatePaymentMethod');
            updatePaymentMethod({
                accountId: userData.currentAccount.id,
                paymentMethodId: paymentMethodId
            }).then(res => {
                if (!mountedRef.current) return null
                setSuccess(true);
                setProcessing(false);
            }).catch(err => {
                if (!mountedRef.current) return null
                setProcessing(false);
                setErrorMessage(err.message);
            });
        }else{
            setProcessing(false);
        }
    }

    useEffect(() => {
        setBreadcrumb([
            {
                to: "/",
                text: "Home",
                active: false
            },
            {
                to: "/account/"+userData.currentAccount.id+"/",
                text: userData.currentAccount.name,
                active: false
            },
            {
                to: "/account/"+userData.currentAccount.id+"/billing",
                text: 'Billing',
                active: false
            },   
            {
                to: null,
                text: title,
                active: true
            }
        ]);
    },[userData, setBreadcrumb, title]);

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    return (
        <>
            <Paper>
                <Box p={2}>
                    {userData.currentAccount.price > 0 ? (
                        <Stack spacing={3}>
                            {(userData.currentAccount.owner === authUser.user.uid)?(
                                <>
                                    {success && 
                                    <Alert severity="success" onClose={() => setSuccess(false)}>The payment method has been successfully updated.</Alert>
                                    }
                                    {errorMessage !== null && 
                                    <Alert severity="error" onClose={() => setErrorMessage(null)}>{errorMessage}</Alert>
                                    }
                                    {cardError !== null && 
                                        <Alert severity="error" onClose={() => setCardError(null)}>{cardError}</Alert>
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
                                    <Stack direction="row" spacing={1} mt={2}>
                                        <Button variant="contained" disabled={processing} onClick={(e) => subscribe(e)}>
                                            {processing?(
                                                <><Loader /> Processing...</>
                                            ):(
                                                <>Save</>
                                            )}
                                        </Button>
                                        <Button variant="contained" color="secondary" disabled={processing} onClick={() => history.push("/account/"+userData.currentAccount.id+"/billing")}>Back</Button>
                                    </Stack>
                                </>
                            ):(
                                <Alert type="danger" message="Access Denied." dismissible={false} ></Alert>
                            )}
                        </Stack>
                    ):(
                        <Alert severity="error">The account doesn't support payment methods.</Alert>
                    )}
                </Box>
            </Paper>
        </>

    )
}

export default PaymentMethod;