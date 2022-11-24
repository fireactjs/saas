import { AuthContext, SetPageTitle } from "@fireactjs/core";
import { Box, Button, Container, Grid, Paper } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "firebase/compat/firestore";

export const ListSubscriptions = () => {

    const { firebaseApp } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        let subscriptions = [];
        const subscriptionsRef = firebaseApp.firestore().collection('subscriptions');
        const query = subscriptionsRef.where('permissions.access', 'array-contains', firebaseApp.auth().currentUser.uid);
        query.get().then(res => {
            console.log(res);
        }).catch(error => {
            console.log(error);
        })
    },[]);

    return (
        <Container>
            <SetPageTitle title="My Subscriptions" />
            <Paper>
                <Box p={5}>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <h2>My Subscriptions</h2>
                        </Grid>
                        <Grid item textAlign="right">
                            <Button variant="contained" onClick={() => navigate('/create')}>Add Subscription</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}