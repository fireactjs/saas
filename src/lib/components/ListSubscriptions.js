import { AuthContext, SetPageTitle } from "@fireactjs/core";
import { Box, Button, Card, CardActions, CardHeader, Container, Grid, Paper } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "firebase/compat/firestore";

export const ListSubscriptions = ({loader}) => {

    const { firebaseApp } = useContext(AuthContext);
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(false);
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
            setLoaded(true);
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
                    {loaded?(
                        <Grid container spacing={3}>
                            {subscriptions.map((subscription, i) => 
                                <Grid item xs={12} md={4} key={i}>
                                    <Card>
                                        <CardHeader title={subscription.name?subscription.name:"Untitled"} subheader={subscription.id} />
                                        <CardActions>
                                            <Button variant="outlined" color="success">Access</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    ):(
                        <Box p={5}>
                            {loader}
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    )
}