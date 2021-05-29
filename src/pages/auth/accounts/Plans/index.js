import React, {useState, useContext, useEffect, useRef} from "react";
import { FirebaseAuth, CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import { AuthContext } from "../../../../components/FirebaseAuth";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import Loader from '../../../../components/Loader';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Alert from "../../../../components/Alert";
import { countries } from "../../../../inc/country.json";

const Plans = () => {
    const title = 'Select a Plan';

    const { userData, authUser } = useContext(AuthContext);
    const stripe = useStripe();
    const elements = useElements();
    const mountedRef = useRef(true);
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

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [plans, setPlans] = useState([]);
    const [taxes, setTaxes] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState({id: 0});
    const [cardError, setCardError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");

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
                to: null,
                text: title,
                active: true
            }
        ]);
        setLoading(true);

        const plansQuery = FirebaseAuth.firestore().collection('plans').orderBy('price', 'asc');
        const taxesQuery = FirebaseAuth.firestore().collection('taxes');
        Promise.all([plansQuery.get(), taxesQuery.get()]).then(([planSnapShots, taxSnapShots]) => {
            if (!mountedRef.current) return null
            let p = [];
            planSnapShots.forEach(doc => {
                p.push({
                    'id': doc.id,
                    'name': doc.data().name,
                    'price': doc.data().price,
                    'currency': doc.data().currency,
                    'paymentCycle': doc.data().paymentCycle,
                    'features': doc.data().features,
                    'stripePriceId': doc.data().stripePriceId,
                    'current': (userData.currentAccount.planId===doc.id)?true:false
                });
            });
            if(p.length > 0){
                const ascendingOrderPlans = p.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                setPlans(ascendingOrderPlans);
            }
            let t = [];
            taxSnapShots.forEach(doc => {
                t.push({
                    'id': doc.id,
                    'applicable': doc.data().applicable,
                    'rate': doc.data().rate
                });
            });
            if(t.length > 0){
                setTaxes(t);
            }
            setLoading(false);
        });
        return () => { 
            mountedRef.current = false
        }
    },[userData, setBreadcrumb, title]);

    const subcribe = async(event) => {
        event.preventDefault();
        setProcessing(true);
        setErrorMessage(null);

        let hasError = false;
        let paymentMethodId = '';

        if(selectedPlan.price !== 0){
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
                card: cardElement
            });
    
            if (error) {
                setCardError(error.message);
                hasError = true;
            } else {
                paymentMethodId = paymentMethod.id;
            }
        }

        
        if(!hasError){
            const createSubscription = CloudFunctions.httpsCallable('createSubscription');
            createSubscription({
                planId: selectedPlan.id,
                accountId: userData.currentAccount.id,
                paymentMethodId: paymentMethodId,
                billing: {
                    country: country,
                    state: state
                }
            }).then(res => {
                // physical page load to reload the account data
                document.location = '/account/'+userData.currentAccount.id+'/';
            }).catch(err => {
                setProcessing(false);
                setErrorMessage(err.message);
            });
        }else{
            setProcessing(false);
        }
    }

    return (
        <>
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="card-deck mb-3">
                        <div className="card">
                            <div className="card-header text-center"><h3>{title}</h3></div>
                            <div className="card-body">
                                {(userData.currentAccount.owner === authUser.user.uid)?(
                                    <>
                                        {errorMessage !== null && 
                                        <Alert type="danger" message={errorMessage} dismissible={true} onDismiss={() => setErrorMessage(null)}></Alert>
                                        }
                                        {plans.length > 0 ? (
                                            <div className="row justify-content-md-center">
                                            <div className="col col-sm-12 col-md-8 col-lg-8 col-xl-8">

                                            <div className="card-deck mb-5 text-center">
                                            {plans.map((plan,i) => 
                                                    <div className="card" key={i+plan.id}>
                                                        <div className="card-header">
                                                            <h4 className="my-0 font-weight-normal">
                                                                {plan.name}
                                                            </h4>
                                                            <h1 className="card-title">
                                                                ${plan.price}
                                                                <small className="text-muted">
                                                                    /{plan.paymentCycle}
                                                                </small>
                                                            </h1>
                                                        </div>
                                                        <div className="card-body">
                                                            <ul className="list-unstyled mt-3 mb-4">
                                                                {plan.features.map((feature, i) => 
                                                                    <li key={i}><i className="fa fa-check text-success"></i> {feature}</li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                        <div className="card-footer bg-white">
                                                            {plan.current?(
                                                                <button type="button" className="btn btn-block btn-secondary" disabled={true}>Current Plan</button>
                                                            ):(
                                                                <button type="button" className={(plan.id!==selectedPlan.id)?"btn btn-block btn-outline-success":"btn btn-block btn-success"} onClick={() => {
                                                                    for(let i=0; i<plans.length; i++){
                                                                        if(plans[i].id === plan.id){
                                                                            setSelectedPlan(plan);
                                                                        }
                                                                    }
                                                                }}>{plan.id===selectedPlan.id && <><i className="fa fa-check"></i> </>}{(plan.id!==selectedPlan.id)?"Select":"Selected"}</button>    
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            </div>
                                        
                                            {selectedPlan.id !== 0 && selectedPlan.price > 0 && 
                                            <div className="card-deck">
                                                <div className="card mb-4">
                                                    <div className="card-header text-center">
                                                        <h3>Billing Details</h3>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="form-group row">
                                                            <label className="col-lg-3 col-form-label mt-2 text-lg-right"><b>Country/Territory</b></label>
                                                            <div className="col-lg-9 mt-2">
                                                                <select className="form-control" defaultValue={country} onChange={e => {
                                                                    const countryCode = e.target.selectedOptions[0].value;
                                                                    setCountry(countryCode);
                                                                    setState("");
                                                                }}>
                                                                    <option value=''>-- Select a country --</option>
                                                                    {Object.keys(countries).map((countryCode) => 
                                                                        <option value={countryCode} key={countryCode}>{countries[countryCode].name}</option>
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        {countries[country] && countries[country].states &&
                                                            <div className="form-group row">
                                                                <label className="col-lg-3 col-form-label mt-2 text-lg-right"><b>State/Province</b></label>
                                                                <div className="col-lg-9 mt-2">
                                                                    <select className="form-control" defaultValue={state} onChange={e => {
                                                                        setState(e.target.selectedOptions[0].value);
                                                                    }}>
                                                                        <option value=''>-- Select a state --</option>
                                                                        {Object.keys(countries[country].states).map(stateCode => 
                                                                            <option value={stateCode} key={stateCode}>{countries[country].states[stateCode]}</option>
                                                                        )}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className="form-group row mb-0">
                                                            <label className="col-lg-3 col-form-label mt-2 text-lg-right"><b>Credit/Debit Card</b></label>
                                                            <div className="col-lg-9 mt-2">
                                                                {cardError !== null && 
                                                                    <Alert type="danger" message={cardError} dismissible={true} onDismiss={() => setCardError(null)}></Alert>
                                                                }
                                                                <div className="form-control">
                                                                    <CardElement options={CARD_ELEMENT_OPTIONS}></CardElement>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            }
                                            {selectedPlan.id!==0 &&                                             
                                                <button className="btn btn-lg btn-block btn-primary" disabled={selectedPlan.id===0||processing?true:false} onClick={e => {
                                                    subcribe(e);
                                                }}>{processing?(<Loader text="Please wait while subscription being processed..."></Loader>):(<>Subscribe</>)}</button>
                                            }
                                            </div>
                                        </div>
                                        ):(
                                            <>
                                                {(loading) ? (
                                                    <Loader text="loading plans..."></Loader>
                                                ):(
                                                    <div>No plan is found</div>
                                                )}
                                            </>
                                        )}
                                    </>
                                ):(
                                    <Alert type="danger" message="Access Denied." dismissible={false} ></Alert>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Plans;
