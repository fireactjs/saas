import { AuthContext, SetPageTitle } from "@fireactjs/core";
import { Box, Button, Card, CardActions, CardHeader, Container, Grid, Paper, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "firebase/compat/firestore";

export const ListSubscriptions = () => {

    const { firebaseApp } = useContext(AuthContext);
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        let subscriptions = [];
        const subscriptionsRef = firebaseApp.firestore().collection('subscriptions');
        const query = subscriptionsRef.where('permissions.access', 'array-contains', firebaseApp.auth().currentUser.uid);
        query.get().then(res => {
            res.forEach(record => {
                subscriptions.push({
                    id: record.id,
                    name: record.data().name
                });
            })
            setSubscriptions(subscriptions);
        }).catch(error => {
            console.log(error);
        })
    },[firebaseApp]);

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
                    <Grid container spacing={3}>
                        {subscriptions.map((subscription, i) => 
                            <Grid item xs={12} md={4} key={i}>
                                <Card>
                                    <CardHeader title={subscription.name?subscription.name:"Untitled"} subheader={subscription.id} />
                                    <CardActions>
                                        <Button variant="outlined" color="primary">Access</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}