import React, { useContext, useEffect, useState, useRef } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import { useHistory, Redirect } from "react-router-dom";
import Loader from "../../../../components/Loader";
import { currency } from "../../../../inc/currency.json";
import { Paper, Box, Alert, Button, Stack} from "@mui/material";

const DeleteAccount = () => {
    const title = 'Delete Account';
    const history = useHistory();
    const { userData } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [inSubmit, setInSubmit] = useState(false);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    const mountedRef = useRef(true);

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
    },[userData,setBreadcrumb,title]);

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    return (
        <>
            {success?(
                <Redirect to="/"></Redirect>
            ):(
                <>
                    <Paper>
                        <Box p={2}>
                            {error !== null && 
                                <Box p={3}>
                                    <Alert severity="error">{error}</Alert>
                                </Box>
                            }
                            <p>Your current subscription period will end on <strong>{(new Date(userData.currentAccount.subscriptionCurrentPeriodEnd * 1000)).toLocaleDateString()}</strong>.</p>
                            <p>The system will charge <strong>{currency[userData.currentAccount.currency].sign}{userData.currentAccount.price}/{userData.currentAccount.paymentCycle}</strong> to renew the subscription. Deleting the account will stop the subscription and no renewal payment will be charged.</p>
                            <p className="text-danger">Are you sure you want to delete your account?</p>
                            <Stack direction="row" spacing={1} mt={2}>
                                <Button variant="contained" color="error" disabled={inSubmit} onClick={() => {
                                    setInSubmit(true);
                                    const cancelSubscription = CloudFunctions.httpsCallable('cancelSubscription');
                                    cancelSubscription({
                                        accountId: userData.currentAccount.id
                                    }).then(res => {
                                        if (!mountedRef.current) return null
                                        setSuccess(true);
                                        setInSubmit(false);
                                    }).catch(err => {
                                        if (!mountedRef.current) return null
                                        setError(err.message);
                                        setInSubmit(false);
                                    })
                                }}>
                                {inSubmit && 
                                    <Loader />
                                }
                                    Yes, I want to delete the account</Button>
                                <Button variant="contained" color="secondary" onClick={() => history.push("/account/"+userData.currentAccount.id+"/billing")}>No, Go Back</Button>
                            </Stack>
                        </Box>
                    </Paper>
                </>
            )}
            
        </>
    )
}

export default DeleteAccount;