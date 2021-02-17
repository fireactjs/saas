import React, {useState, useContext, useEffect} from "react";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import { AuthContext } from "../../../../components/FirebaseAuth";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import Loader from '../../../../components/Loader';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Alert from "../../../../components/Alert";

const PaymentMethod = () => {
    const title = 'Update Payment Method';

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

    const subcribe = async(event) => {
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
                setSuccess(true);
                setProcessing(false);
            }).catch(err => {
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
    },[userData, setBreadcrumb, title])

    return (
        <>
            <div className="container-fluid">
                <div className="animated fadeIn">
                    {userData.currentAccount.price > 0 ? (
                        <>
                            <div className="card-deck mb-3">
                                <div className="card">
                                    <div className="card-header text-center">{title}</div>
                                    <div className="card-body">
                                        {(userData.currentAccount.owner === authUser.user.uid)?(
                                            <>
                                                {success && 
                                                <Alert type="success" message="The payment method has been successfully updated." dismissible={true} onDismiss={() => setSuccess(false)}></Alert>
                                                }
                                                {errorMessage !== null && 
                                                <Alert type="danger" message={errorMessage} dismissible={true} onDismiss={() => setErrorMessage(null)}></Alert>
                                                }
                                                <div className="row justify-content-md-center">
                                                    <div className="col col-sm-12 col-md-8 col-lg-8 col-xl-6">
                                                    <div className="card-deck">
                                                        <div className="card mb-4">
                                                            <div className="card-header text-center">
                                                                Credit or debit card
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="row justify-content-md-center">
                                                                    <div className="col col-12">
                                                                        {cardError !== null && 
                                                                            <Alert type="danger" message={cardError} dismissible={true} onDismiss={() => setCardError(null)}></Alert>
                                                                        }
                                                                        <CardElement options={CARD_ELEMENT_OPTIONS}></CardElement>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-lg btn-block btn-primary" disabled={processing?true:false} onClick={e => {
                                                        subcribe(e);
                                                    }}>{processing?(<Loader text="Please wait..."></Loader>):(<>Save</>)}</button>
                                                    </div>
                                                </div>
                                            </>
                                        ):(
                                            <Alert type="danger" message="Access Denied." dismissible={false} ></Alert>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ):(
                        <div>The account doesn't support payment methods.</div>
                    )}
                </div>
            </div>
        </>

    )
}

export default PaymentMethod;