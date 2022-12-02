import React, { useContext, useEffect, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import "firebase/compat/functions";
import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Paper, Box, Container, Grid, Button, Avatar, Alert } from "@mui/material";
import { PaginationTable } from "./PaginationTable";
import { useNavigate } from "react-router-dom";

export const ListUser = ({loader}) => {
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
    const [pageSize, setPageSize] = useState(2);
    const [rows, setRows] = useState([]);

    const [error, setError] = useState(null);

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
                }}><Avatar alt={user.displayName} src={user.photoUrl} /><strong style={{marginLeft: '15px'}}>{user.displayName}</strong></div>
                user.permissionCol = user.permissions.join(", ");
                user.emailCol = user.email;
                if(subscription.ownerId !== user.id){
                    user.actionCol = <Button size="small" variant="outlined" onClick={() => navigate(pathnames.UpdateUser.replace(":subscriptionId", subscription.id).replace(":userId", user.id))}>Change Role</Button>
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
                                            <h2>User List</h2>
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
            ):(
                <>{loader}</>
            )}
        </>
    )
}