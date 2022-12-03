import React, { useContext, useEffect, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import "firebase/compat/functions";
import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Paper, Box, Container, Grid, Button, Avatar, Alert, Typography, TextField, FormControl, FormLabel, FormControlLabel, Checkbox } from "@mui/material";
import { PaginationTable } from "./PaginationTable";
import { useNavigate } from "react-router-dom";
import { doc, getFirestore, setDoc } from 'firebase/firestore';


export const ListUsers = ({loader}) => {
    const { config } = useContext(FireactContext);
    const pathnames = config.pathnames;

    const { subscription } = useContext(SubscriptionContext);
    const subscriptionName = subscription.name?subscription.name:"";
    const [ users, setUsers ] = useState([]);

    const { firebaseApp } = useContext(AuthContext);
    const CloudFunctions = firebaseApp.functions();

    const [loaded, setLoaded] = useState(false);

    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [rows, setRows] = useState([]);

    const [error, setError] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setError(null);
        const getSubscriptionUsers = CloudFunctions.httpsCallable('fireactjsSaas-getSubscriptionUsers');
        getSubscriptionUsers({subscriptionId: subscription.id}).then(result => {
            setTotal(result.data.total);
            result.data.users.forEach(user => {
                user.nameCol = <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}><Avatar alt={user.displayName} src={user.photoURL} /><strong style={{marginLeft: '15px'}}>{user.displayName}</strong></div>
                user.permissionCol = user.permissions.join(", ");
                user.emailCol = user.email;
                if(subscription.ownerId !== user.id){
                    user.actionCol = <Button size="small" variant="outlined" onClick={() => setSelectedUser({
                        id: user.id,
                        email: user.email,
                        name: user.displayName,
                        permissions: user.permissions
                    })}>Update</Button>
                }
            })
            result.data.users.sort((a,b) => a.displayName > b.displayName);
            setUsers(result.data.users);
            setLoaded(true);
        }).catch(error => {
            setError(error.message);
            setLoaded(true);
        });
    }, [subscription.id, CloudFunctions, navigate, pathnames.UpdateUser, subscription.ownerId]);

    useEffect(() => {
        const startIndex = page * pageSize;
        let records = [];
        for(let i=startIndex; i<users.length; i++){
            if(i>=startIndex+pageSize){
                break;
            }
            records.push(users[i]);
        }
        if(records.length > 0){
            setRows(records);
        }
        window.scrollTo(0, 0);
    },[page, pageSize, users]);


    return (
        <>
            {loaded?(
                <>
                {selectedUser !== null?(
                    <UpdateUser user={selectedUser} setSelectedUser={setSelectedUser} setUsers={setUsers} />
                ):(
                    <Container maxWidth="lx">
                        {error !== null?(
                            <Alert severity="error">{error}</Alert>
                        ):(
                            <>
                                <SetPageTitle title={"User List"+(subscriptionName!==""?(" - "+subscriptionName):"")} />
                                <Paper>
                                    <Box p={2}>
                                        <Grid container direction="row" justifyContent="space-between" alignItems="center">
                                            <Grid item>
                                                <Typography component="h1" variant="h4">User List</Typography>
                                            </Grid>
                                            <Grid item textAlign="right">
                                                <Button variant="contained" onClick={() => navigate(pathnames.AddUser.replace(":subscriptionId", subscription.id))}>Add User</Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box p={2}>
                                        <PaginationTable columns={[
                                            {name: "Name", field: "nameCol", style: {width: '30%'}},
                                            {name: "Email", field: "emailCol", style: {width: '40%'}},
                                            {name: "Permissions", field: "permissionCol", style: {width: '20%'}},
                                            {name: "Action", field: "actionCol", style: {width: '10%'}}
                                        ]}
                                        rows={rows}
                                        totalRows={total}
                                        pageSize={pageSize}
                                        page={page}
                                        handlePageChane={(e, p) => {
                                            setPage(p);
                                        }}
                                        handlePageSizeChange={(e) => {
                                            setPage(0);
                                            setPageSize(e.target.value);
                                        }}
                                        />
                                    </Box>
                                </Paper>
                            </>
                        )}
                    </Container>
                )}
                </>
            ):(
                <>{loader}</>
            )}
        </>
    )
}

const UpdateUser = ({user, setSelectedUser, setUsers}) => {

    const { subscription, setSubscription } = useContext(SubscriptionContext);
    const subscriptionName = subscription.name?subscription.name:"";

    const { config } = useContext(FireactContext);
    const permissions = config.saas.permissions || {};

    const [ processing, setProcessing ] = useState(false);

    const { firebaseApp } = useContext(AuthContext);

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
                                    {user.name}
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
                                            } label={key} />
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
                            <Button type="button" color="primary" variant="contained" disabled={processing} onClick={() => {
                                setProcessing(true);
                                setError(null);
                                setSuccess(false);
                                const db = getFirestore(firebaseApp);
                                const docRef = doc(db, "subscriptions", subscription.id);
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
                                                permissions: userPermissions, 
                                                permissionCol: userPermissions.join(", "),
                                                actionCol: <Button size="small" variant="outlined" onClick={() => setSelectedUser({
                                                        id: user.id,
                                                        email: user.email,
                                                        name: user.displayName,
                                                        permissions: userPermissions
                                                })}>Update</Button>
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
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}