import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Alert, Box, Button, Card, CardActions, CardHeader, Container, Grid, Paper, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { Stack } from "@mui/system";
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';

export const ListSubscriptions = ({loader}) => {

    const { authInstance, firestoreInstance, functionsInstance } = useContext(AuthContext);
    const { config } = useContext(FireactContext);
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [invites, setInvites] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [acceptedInviteCount, setAcceptedInviteCount] = useState(0);

    useEffect(() => {
        setLoaded(false);
        setError(null);
        // get default permission level name
        let defaultPermission = '';
        for(var permission in config.saas.permissions){
            const value = config.saas.permissions[permission];
            if(value.default){
                defaultPermission = permission;
            }
        }
        let subscriptions = [];
        let invites = [];

        //const subscriptionsRef = firebaseApp.firestore().collection('subscriptions');
        const subscriptionsRef = collection(firestoreInstance, '/subscriptions');
        //const subQuery = subscriptionsRef.where('permissions.'+defaultPermission, 'array-contains', firebaseApp.auth().currentUser.uid);
        const subQuery = query(subscriptionsRef, where('permissions.'+defaultPermission, 'array-contains', authInstance.currentUser.uid));
        //const invitesRef = firebaseApp.firestore().collection('invites');
        const invitesRef = collection(firestoreInstance, '/invites');
        //const inviteQuery = invitesRef.where('email', '==', firebaseApp.auth().currentUser.email);
        const inviteQuery = query(invitesRef, where('email', '==', authInstance.currentUser.email));
        Promise.all([getDocs(subQuery), getDocs(inviteQuery)]).then(([subSnapshot, inSnapshot]) => {
            subSnapshot.forEach(record => {
                subscriptions.push({
                    id: record.id,
                    name: record.data().name
                });
            })
            inSnapshot.forEach(record => {
                invites.push({
                    id: record.id,
                    sender: record.data().sender,
                    subscriptionName: record.data().subscriptionName || "Untitled"
                })
            })
            setSubscriptions(subscriptions);
            setInvites(invites);
            setLoaded(true);
        }).catch(error => {
            setLoaded(true);
            setError(error.message);
        })
    },[authInstance, config.saas.permissions, acceptedInviteCount, firestoreInstance]);

    return (
        <>
            {loaded?(
                <Container maxWidth="lx">
                    <SetPageTitle title="My Subscriptions" />
                    <Paper>
                        <Box p={2}>
                            <Grid container direction="row" justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    <Typography component="h1" variant="h4">My {config.saas.subscription.plural}</Typography>
                                </Grid>
                                <Grid item textAlign="right">
                                    <Button variant="contained" onClick={() => navigate(config.pathnames.CreateSubscription)}>Add {config.saas.subscription.singular}</Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box p={2}>
                            {error !== null?(
                                <Alert severity="error">{error}</Alert>
                            ):(
                                <>
                                    {invites.length > 0 && authInstance.currentUser.emailVerified && 
                                        <Stack spacing={2} mb={2}>
                                            {invites.map((invite, i) => 
                                                <Alert key={i} severity="info" action={
                                                    <>
                                                        <Button color="success" disabled={processing} size="small" onClick={() => {
                                                            setProcessing(true);
                                                            const acceptInvite = httpsCallable(functionsInstance, 'fireactjsSaas-acceptInvite');
                                                            acceptInvite({inviteId: invite.id}).then(() => {
                                                                setProcessing(false);
                                                                setAcceptedInviteCount(prevState => (prevState+1));
                                                            }).catch(error => {
                                                                // something went wrong
                                                                setProcessing(false);                                                                
                                                            })
                                                        }}>Accept</Button>
                                                        <Button color="warning" disabled={processing} size="small" onClick={() => {
                                                            setProcessing(true);
                                                            const docRef = doc(firestoreInstance, 'invites/'+invite.id);
                                                            const inviteRef = getDoc(docRef);
                                                            inviteRef.delete().then(() => {
                                                                setInvites(prevState =>  prevState.filter(row => {
                                                                    return (row.id !== invite.id)
                                                                }));
                                                                setProcessing(false);
                                                            }).catch(error => {
                                                                // something went wrong
                                                                setProcessing(false);
                                                            })
                                                        }}>Reject</Button>
                                                    </>
                                                }>
                                                    You are invited to join <strong>{invite.subscriptionName}</strong> by <strong>{invite.sender}</strong>
                                                </Alert>
                                            )}
                                        </Stack>
                                    }
                                    {invites.length > 0 && !authInstance.currentUser.emailVerified && 
                                        <Stack spacing={2} mb={2}>
                                            <Alert severity="warning" action={<Button size="small" onClick={() => navigate(config.pathnames.UserProfile)} >My Profile</Button>}>
                                                You have invites but your email is not verified. Please go to your profile and verify your email to accept the invites.
                                            </Alert>
                                        </Stack>
                                    }
                                    <Grid container spacing={3}>
                                        {subscriptions.length>0?(subscriptions.map((subscription, i) => 
                                            <Grid item xs={12} md={4} key={i}>
                                                <Card>
                                                    <CardHeader title={subscription.name?subscription.name:"Untitled"} subheader={subscription.id} />
                                                    <CardActions>
                                                        <Button variant="outlined" color="success" onClick={() => {
                                                            navigate(config.pathnames.Subscription.replace(":subscriptionId", subscription.id));
                                                        }}>Access</Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        )):(
                                            <Grid item >
                                                You don't have access to any {config.saas.subscription.singular}. Please create one or ask your admin to invite you to one.
                                            </Grid>
                                        )}
                                    </Grid>
                                </>
                            )}
                        </Box>
                    </Paper>
                </Container>
            ):(
                <>{loader}</>
            )}
        </>
    )
}