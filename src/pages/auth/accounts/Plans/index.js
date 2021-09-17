import React, {useState, useContext, useEffect, useRef} from "react";
import { FirebaseAuth, CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import { AuthContext } from "../../../../components/FirebaseAuth";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import Loader from '../../../../components/Loader';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { countries } from "../../../../inc/country.json";
import { countries as countryData } from "../../../../inc/countries.json";
import { Paper, Box, Grid, Card, CardHeader, CardContent, CardActions, Button, Divider, Container, Autocomplete, TextField, Stack, Alert } from "@mui/material";


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
    const [selectedPlan, setSelectedPlan] = useState({id: 0});
    const [cardError, setCardError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [country, setCountry] = useState("");
    const [countryError, setCountryError] = useState(null);
    const [state, setState] = useState("");
    const [states, setStates] = useState([]);
    const [stateError, setStateError] = useState(null);

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
        plansQuery.get().then(planSnapShots => {
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
            if(country === ''){
                setCountryError('Please select a country.');
                hasError = true;
            }

            if(state === '' && countries[country] && countries[country].states){
                setStateError('Please select a state.');
                hasError = true;
            }

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
        {(!loading)?(
            <>{(userData.currentAccount.owner === authUser.user.uid)?(
            <>{plans.length > 0 ? (
            <Paper>
                <Box p={3} style={{textAlign: 'center'}} >
                    <h2>{title}</h2>
                    <Grid container spacing={3}>
                        
                            <>
                            {plans.map((plan,i) => 
                                <Grid container item xs={12} md={4} key={i} >
                                    <Card style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        paddingBottom: '20px',
                                    }}>
                                        <CardHeader title={plan.name} subheader={"$"+plan.price+"/"+plan.paymentCycle} />
                                        <CardContent>
                                            <Divider />
                                            <ul style={{listStyleType: 'none', paddingLeft: '0px'}}>
                                            {plan.features.map((feature, i) => 
                                                <li key={i}>
                                                    <i className="fa fa-check" style={{color: "#2e7d32"}} /> {feature}
                                                </li>
                                            )}
                                            </ul>
                                        </CardContent>
                                        <CardActions style={{
                                            marginTop: 'auto',
                                            justifyContent: 'center',
                                        }}>
                                            {plan.current?(
                                                <Button color="success" variant="contained" disabled={true}>Current Plan</Button>
                                            ):(
                                                <Button color="success" variant={(plan.id!==selectedPlan.id)?"outlined":"contained"} onClick={() => {
                                                    for(let i=0; i<plans.length; i++){
                                                        if(plans[i].id === plan.id){
                                                            setSelectedPlan(plan);
                                                        }
                                                    }
                                                }}>{plan.id===selectedPlan.id && <><i className="fa fa-check" /> </>}{(plan.id!==selectedPlan.id)?"Select":"Selected"}</Button>    
                                            )}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )}
                            </>
                        
                    </Grid>
                    {selectedPlan.id !== 0 && selectedPlan.price > 0 && 
                        <div style={{justifyContent: 'center', marginTop: '50px'}}>
                            <h2>Billing Details</h2>
                            <Grid container spacing={3}>
                                <Grid container item xs={12}>
                                    <Card style={{
                                        width: '100%',
                                        paddingBottom: '20px',
                                    }}>
                                        <CardContent>
                                            <Container maxWidth="sm">
                                                <Stack spacing={3}>
                                                    {countryError !== null && 
                                                        <Alert severity="error" onClose={() => setCountryError(null)}>{countryError}</Alert>
                                                    }
                                                    <Autocomplete
                                                        value={(country !== '')?(countryData.find(obj =>{
                                                            return obj.code === country
                                                        })):(null)}
                                                        options={countryData}
                                                        autoHighlight
                                                        getOptionLabel={(option) => option.label}
                                                        renderOption={(props, option) => (
                                                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                                <img
                                                                    loading="lazy"
                                                                    width="20"
                                                                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                                    alt=""
                                                                />
                                                                {option.label}
                                                            </Box>
                                                        )}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Country"
                                                                inputProps={{
                                                                    ...params.inputProps,
                                                                    autoComplete: 'new-password',
                                                                }}
                                                            />
                                                        )}
                                                        onChange={(event, newValue) => {
                                                            if(newValue && newValue.code){
                                                                setCountry(newValue.code);
                                                                setState("");
                                                                if(newValue.states){
                                                                    setStates(newValue.states);
                                                                }else{
                                                                    setStates([]);
                                                                }
                                                                setCountryError(null);
                                                            }
                                                        }}
                                                    />
                                                    {states.length > 0 &&
                                                    <>
                                                        {stateError !== null && 
                                                            <Alert severity="error" onClose={() => setStateError(null)}>{stateError}</Alert>
                                                        }
                                                        <Autocomplete
                                                            value={(state !== '')?(states.find(obj =>{
                                                                return obj.code === state
                                                            })):(null)}
                                                            options={states}
                                                            autoHighlight
                                                            getOptionLabel={(option) => option.label}
                                                            renderOption={(props, option) => (
                                                                <Box component="li" {...props}>
                                                                    {option.label}
                                                                </Box>
                                                            )}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="State"
                                                                    inputProps={{
                                                                        ...params.inputProps,
                                                                        autoComplete: 'new-password',
                                                                    }}
                                                                />
                                                            )}
                                                            onChange={(event, newValue) => {
                                                                if(newValue && newValue.code){
                                                                    setState(newValue.code);
                                                                    setStateError(null);
                                                                }
                                                                
                                                            }}
                                                        />
                                                    </>
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
                                                </Stack>
                                            </Container>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    }
                    {selectedPlan.id!==0 &&
                        <div style={{marginTop: '50px'}}>
                            <Container maxWidth="sm">
                                <Stack spacing={3}>
                                {errorMessage !== null && 
                                    <Alert severity="error" onClose={() => setErrorMessage(null)}>{errorMessage}</Alert>
                                }
                                <Button color="success" size="large" variant="contained" disabled={selectedPlan.id===0||processing?true:false} onClick={e => {
                                    subcribe(e);
                                }}>{processing?(<><Loader /> Processing...</>):(<>Subscribe Now</>)}</Button>
                                </Stack>
                            </Container>
                        </div>
                    }
                </Box>
            </Paper>
            ):(
                <Alert severity="warning">No plan is found.</Alert>
            )}</>
            ):(
                <Alert severity="error" >Access Denied.</Alert>
            )}</>
        ):(
            <Loader text="loading plans..." />
        )}
        </>

    )
}

export default Plans;
