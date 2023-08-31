import React, { useContext, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { Alert, Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { AuthContext, SetPageTitle } from "@fireactjs/core";
import { FireactContext } from "@fireactjs/core";
import { doc, setDoc } from 'firebase/firestore';

export const Settings = () => {
    const { subscription, setSubscription } = useContext(SubscriptionContext);
    const defaultName = subscription.name?subscription.name:"";
    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(null);
    const [ processing, setProcessing ] = useState(false);
    const { config } = useContext(FireactContext);
    const label = config.saas.subscription.singular.substr(0,1).toUpperCase() + config.saas.subscription.singular.substr(1);
    const { firestoreInstance } = useContext(AuthContext);

    const [ subscriptionName, setSubscriptionName ] = useState(defaultName);

    const updateSubscription = () => {
        setProcessing(true);
        setError(null);
        setSuccess(null);
        const docRef = doc(firestoreInstance, "subscriptions", subscription.id);
        if(subscriptionName.trim() !== ""){
            setDoc(docRef, {name: subscriptionName}, {merge: true}).then(() => {
                setSuccess('The settings have been successfully updated.');
                setProcessing(false);
                setSubscription(prevState => ({
                    ...prevState,
                    name: subscriptionName
                 }));
            }).catch(error => {
                setError(error.message);
                setProcessing(false);
            })
        }else{
            setError(label + " is a required field.");
            setProcessing(false);
        }
    }

    return (
        <Container maxWidth="md">
            <SetPageTitle title={"Settings"+(subscriptionName!==""?(" - "+subscriptionName):"")} />
            <Paper>
                <Box p={2}>
                    <Typography component="h1" variant="h4" align="center">Settings</Typography>
                </Box>
                {error !== null &&
                    <Box p={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                }
                {success !== null &&
                    <Box p={2}>
                        <Alert severity="success">{success}</Alert>
                    </Box>
                }
                <Box p={2}>
                    <TextField required fullWidth name="title" label={label} type="text" margin="normal" defaultValue={subscription.name} onChange={(e) => setSubscriptionName(e.target.value)} />
                </Box>
                <Box p={2}>
                    <Grid container>
                        <Grid item xs>
                            
                        </Grid>
                        <Grid item>
                            <Button type="button" color="primary" variant="contained" disabled={processing} onClick={() => updateSubscription()} >Save</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}