import React, { useContext, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import "firebase/compat/functions";
import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Paper, Box, Container, Grid, Button, Alert, Typography, FormControl, FormLabel, FormControlLabel, Checkbox } from "@mui/material";
import { doc, setDoc } from 'firebase/firestore';

export const UpdateUser = ({user, setSelectedUser, setUsers}) => {

    const { subscription, setSubscription } = useContext(SubscriptionContext);
    const subscriptionName = subscription.name?subscription.name:"";

    const { config } = useContext(FireactContext);
    const permissions = config.saas.permissions || {};

    const [ processing, setProcessing ] = useState(false);

    const { firestoreInstance } = useContext(AuthContext);

    const [ userPermissions, setUserPermissions ] = useState(user.permissions);

    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(false);

    return (
        <Container maxWidth="md">
            <SetPageTitle title={"Update User"+(subscriptionName!==""?(" - "+subscriptionName):"")} />
            <Paper>
                <Box p={2}>
                    <Typography component="h1" variant="h4" align="center">Update User</Typography>
                </Box>
                {error !== null &&
                    <Box p={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                }
                {success &&
                    <Box p={2}>
                        <Alert severity="success">The user record has been successfully updated</Alert>
                    </Box>
                }
                <Box p={2}>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Box p={2}>
                                <FormControl fullWidth>
                                    <FormLabel>Name</FormLabel>
                                    {user.displayName}
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box p={2}>
                                <FormControl fullWidth>
                                    <FormLabel>Email</FormLabel>
                                    {user.email}
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box p={2}>
                        <FormControl fullWidth>
                            <FormLabel>Permissions</FormLabel>
                            <Grid container>
                                {Object.keys(permissions).map((key, index) => {
                                    return (
                                        <Grid item xs={12} md={3} key={index}>
                                            <FormControlLabel control={<Checkbox 
                                                onChange={e => {
                                                    if(e.target.checked){
                                                        setUserPermissions(prevState => [
                                                            ...prevState,
                                                            key
                                                        ]);
                                                    }else{
                                                        setUserPermissions(current => 
                                                            current.filter(p => p !== key)
                                                        );
                                                    }
                                                }}
                                                defaultChecked={user.permissions.indexOf(key)>=0?true:false}
                                                disabled={permissions[key].default?true:false} />
                                            } label={permissions[key].label?permissions[key].label:key} />
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </FormControl>
                    </Box>
                </Box>
                <Box p={2}>
                    <Grid container>
                        <Grid item xs>
                            <Button type="button" color="secondary" variant="outlined" disabled={processing} onClick={() => setSelectedUser(null)} >Back</Button>
                        </Grid>
                        <Grid item>
                            <Button type="button" style={{marginRight: '10px'}} color="primary" variant="contained" disabled={processing} onClick={() => {
                                setProcessing(true);
                                setError(null);
                                setSuccess(false);
                                const docRef = doc(firestoreInstance, "subscriptions", subscription.id);
                                // remove the user from all permissions
                                const subPermissions = subscription.permissions;
                                for(let p in subPermissions){
                                    subPermissions[p] = subPermissions[p].filter(uid => uid !== user.id);
                                }
                                // assign the user to the selected permissions
                                userPermissions.forEach(p => {
                                    subPermissions[p] = subPermissions[p] || [];
                                    subPermissions[p].push(user.id);
                                });
                                setDoc(docRef, {permissions: subPermissions}, {merge: true}).then(() => {
                                    setSubscription(prevState => ({
                                        ...prevState,
                                        permissions: subPermissions
                                    }));
                                    setUsers(prevState => prevState.map(row => {
                                        if(row.id === user.id){
                                            return {
                                                ...row, 
                                                permissions: userPermissions
                                            }
                                        };
                                        return row;
                                    }));
                                    setSuccess(true);
                                    setProcessing(false);
                                }).catch(error => {
                                    setError(error.message);
                                    setProcessing(false)
                                });
                            }} >Save</Button>

                            <Button type="button" color="error" variant="contained" disabled={processing} onClick={() => {
                                setProcessing(true);
                                setError(null);
                                setSuccess(false);
                                const docRef = doc(firestoreInstance, "subscriptions", subscription.id);
                                // remove the user from all permissions
                                const subPermissions = subscription.permissions;
                                for(let p in subPermissions){
                                    subPermissions[p] = subPermissions[p].filter(uid => uid !== user.id);
                                }
                                setDoc(docRef, {permissions: subPermissions}, {merge: true}).then(() => {
                                    setSubscription(prevState => ({
                                        ...prevState,
                                        permissions: subPermissions
                                    }));
                                    setUsers(prevState => prevState.filter(row => {
                                        return row.id !== user.id
                                    }));
                                    setSelectedUser(null);
                                }).catch(error => {
                                    setError(error.message);
                                    setProcessing(false)
                                });
                            }} >Revoke Access</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}