import { AuthContext, SetPageTitle, FireactContext } from "@fireactjs/core";
import { Alert, Box, Container, Paper, Typography, Grid, Button } from "@mui/material";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { BillingDetails } from "./BillingDetails";
import { SubscriptionContext } from "./SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

export const UpdateBillingDetails = ({loader}) => {

    const title = "Update Billing Details";
    const { subscription } = useContext(SubscriptionContext);
    const [ loaded, setLoeaded ] = useState(false);
    const [ error, setError ] = useState(null);
    const auth = getAuth();
    const { firestoreInstance } = useContext(AuthContext);
    const { config } = useContext(FireactContext);
    const navigate = useNavigate();
    const [ billingDetails, setBillingDetails ] = useState(null);
    const [ processing, setProcessing] = useState(false);
    const [ succss, setSuccess] = useState(false);
    const { functionsInstance } = useContext(AuthContext);

    useEffect(() => {
        setLoeaded(false);
        setError(null);
        getDoc(doc(firestoreInstance, 'users/'+auth.currentUser.uid)).then(doc => {
            setBillingDetails(doc.data().billingDetails);
            setLoeaded(true);
        }).catch(err => {
            setError(err.message);
            setLoeaded(true);
        })
    },[auth.currentUser.uid, firestoreInstance]);

    return (
        <>
        {loaded?(
            <Container maxWidth="lx">
                <SetPageTitle title={title} />
                <Paper>
                    <Box p={2}>
                        <Grid container direction="row" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography component="h1" variant="h4">{title}</Typography>
                            </Grid>
                            <Grid item textAlign="right">
                                <Button variant="outlined" size="small" onClick={() => navigate(config.pathnames.ListInvoices.replace(":subscriptionId", subscription.id))}>Invoice List</Button>
                            </Grid>
                        </Grid>
                    </Box>                
                    {error !== null?(
                        <Box p={2}>
                            <Alert severity="error">{error}</Alert>
                        </Box>
                    ):(
                        <>
                            {succss === true &&
                                <Box p={2}>
                                    <Alert severity="success">Billing details have been updated successfully.</Alert>
                                </Box>
                            }
                            <Box p={2}>
                                <BillingDetails disabled={processing} buttonText={"Update"} currentBillingDetails={billingDetails} setBillingDetailsObject={(obj) => {
                                    setProcessing(true);
                                    setSuccess(false);
                                    const changeBillingDetails = httpsCallable(functionsInstance, 'fireactjsSaas-changeBillingDetails');
                                    changeBillingDetails({billingDetails: obj}).then(() => {
                                        setBillingDetails(obj);
                                        setProcessing(false);
                                        setSuccess(true);
                                    }).catch(error => {
                                        setError(error.message);
                                        setProcessing(false);
                                        setSuccess(false);
                                    })
                                }}/>
                            </Box>
                        </>
                    )}
                </Paper>
            </Container>
        ):(
            <>{loader}</>
        )}
        </>
    )
}