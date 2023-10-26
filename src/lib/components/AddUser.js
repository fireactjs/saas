import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Alert, Box, Button, Checkbox, Container, FormControl, FormControlLabel, FormLabel, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
//import "firebase/compat/functions";
import { httpsCallable } from 'firebase/functions';

export const AddUser = ({setAddUserActive, setUsers}) => {

    const { subscription } = useContext(SubscriptionContext);
    const subscriptionName = subscription.name?subscription.name:"";

    const { functionsInstance } = useContext(AuthContext);

    const { config } = useContext(FireactContext);
    const permissions = config.saas.permissions || {};
    const defaultPermissions = [];
    for(let p in permissions){
        if(permissions[p].default){
            defaultPermissions.push(p);
        }
    }

    const [ processing, setProcessing ] = useState(false);

    const [ email, setEmail ] = useState('');
    const [ displayName, setDisplayName ] = useState('');
    const [ userPermissions, setUserPermissions ] = useState(defaultPermissions);

    const [ error, setError ] = useState(null);
    const [ success, setSuccess ] = useState(false);

    return (
        <Container maxWidth="md">
            <SetPageTitle title={"Invite User"+(subscriptionName!==""?(" - "+subscriptionName):"")} />
            <Paper>
                <Box p={2}>
                    <Typography component="h1" variant="h4" align="center">Invite User</Typography>
                </Box>
                {error !== null &&
                    <Box p={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                }
                {success &&
                    <Box p={2}>
                        <Alert severity="success">The invite has been successfully sent</Alert>
                    </Box>
                }
                <Box p={2}>
                    <TextField required fullWidth name="name" label="Name" type="text" margin="normal" onChange={(e) => {setDisplayName(e.target.value)}} />
                    <TextField required fullWidth name="email" label="Email" type="email" margin="normal" onChange={(e) => {setEmail(e.target.value)}} />
                    <Box p={1}>
                        <FormControl fullWidth>
                            <FormLabel>Permissions</FormLabel>
                            <Grid container>
                                {Object.keys(permissions).map((key, index) => {
                                    return (
                                        <Grid item xs={12} md={3} key={index}>
                                            <FormControlLabel control={<Checkbox onChange={e => {
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
                                                defaultChecked={permissions[key].default?true:false}
                                                disabled={permissions[key].default?true:false} />} 
                                                label={permissions[key].label?permissions[key].label:key} />
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
                            <Button type="button" color="secondary" variant="outlined" disabled={processing} onClick={() => setAddUserActive(false)} >Back</Button>
                        </Grid>
                        <Grid item>
                            <Button type="button" color="primary" variant="contained" disabled={processing} onClick={() => {    
                                setProcessing(true);
                                setError(null);
                                setSuccess(false);
                                const inviteUser = httpsCallable(functionsInstance, 'fireactjsSaas-inviteUser');
                                inviteUser({
                                    email: email.toLocaleLowerCase(),
                                    displayName: displayName,
                                    permissions: userPermissions,
                                    subscriptionId: subscription.id
                                }).then(res => {
                                    setUsers(prevState => {
                                        prevState.push(
                                            {
                                                displayName: displayName,
                                                email: email.toLocaleLowerCase(),
                                                id: res.data.inviteId,
                                                permissions: userPermissions,
                                                photoURL: null,
                                                type: "invite"
                                            }
                                        )
                                        return prevState;
                                    });
                                    setProcessing(false);
                                    setSuccess(true);
                                }).catch(error => {
                                    setError(error.message);
                                    setProcessing(false);
                                })
                            }} >Invite</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}