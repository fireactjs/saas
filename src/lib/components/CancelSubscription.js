import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Paper, Container, Box, Typography, TextField, Button, Grid, Alert } from "@mui/material";
import React, { useContext, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

export const CancelSubscription = () => {
    const { subscription } = useContext(SubscriptionContext);
    const [ processing, setProcessing ] = useState(false);
    const [ input, setInput ] = useState("");
    const navigate = useNavigate();
    const { config } = useContext(FireactContext);
    const [ error, setError ] = useState(null);
    const { functionsInstance } = useContext(AuthContext);

    return (
        <Container maxWidth="md">
            <SetPageTitle title={"Cancel Subscription"+(subscription.name!==""?(" - "+subscription.name):"")} />
            <Paper>
                <Box p={2}>
                    <Typography component="h1" variant="h4" align="center">Cancel Subscription</Typography>
                </Box>
                {error !== null &&
                    <Box p={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                }
                <Box p={2}>
                    <Typography component="p" align="center" size="small">
                        Type in <strong>{subscription.id}</strong> and click the "Cancel Subscription" button to confirm the cancellation.
                        This action cannot be undone.
                    </Typography>
                    <TextField required fullWidth name="title" type="text" margin="normal" onChange={e => setInput(e.target.value)} />
                </Box>
                <Box p={2}>
                    <Grid container>
                        <Grid item xs>
                        <Button type="button" color="secondary" variant="outlined" disabled={processing} onClick={() => navigate(config.pathnames.ListInvoices.replace(":subscriptionId", subscription.id))} >Back</Button>
                        </Grid>
                        <Grid item>
                            <Button type="button" color="error" variant="contained" disabled={processing} onClick={() => {
                                setError(null);
                                setProcessing(true);
                                if(input !== subscription.id){
                                    setError("The input confirmation does not match \""+subscription.id+"\"");
                                    setProcessing(false);
                                }else{
                                    const cancelSubscription = httpsCallable(functionsInstance, 'fireactjsSaas-cancelSubscription');
                                    return cancelSubscription({
                                        subscriptionId: subscription.id
                                    }).then(() => {
                                        // redirect
                                        navigate(config.pathnames.ListSubscriptions);
                                    }).catch(error => {
                                        setError(error.message);
                                        setProcessing(false);
                                    })
                                }
                            }} >Cancel Subscription</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}