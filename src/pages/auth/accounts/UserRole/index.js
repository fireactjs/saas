import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import Loader from "../../../../components/Loader";
import {Form} from "../../../../components/Form";
import { Paper, Box, Alert, Select, MenuItem, FormControl, InputLabel, Stack, Button, Typography, Avatar } from "@mui/material";

const UserRole = () => {
    const title = 'Change User Role';
    const history = useHistory();

    const { userData } = useContext(AuthContext);
    const { userId } = useParams();
    const mountedRef = useRef(true);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [inSubmit, setInSubmit] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        setBreadcrumb([
            {
                to: "/",
                text: "Home",
                active: false
            },
            {
                to: "/account/"+userData.currentAccount.id+"/",
                text: userData.currentAccount.name,
                active: false
            },
            {
                to: "/account/"+userData.currentAccount.id+"/users",
                text: 'Manage Users',
                active: false
            },    
            {
                to: null,
                text: title,
                active: true
            }
        ]);
        setError(null);
        const getAccountUser = CloudFunctions.httpsCallable('getAccountUser');
        getAccountUser({
            accountId: userData.currentAccount.id,
            userId: userId
        }).then(res => {
            if (!mountedRef.current) return null
            res.data.lastLoginTime = new Date(res.data.lastLoginTime);
            setUser(res.data);
        }).catch(err => {
            if (!mountedRef.current) return null
            setError(err.message);
        });
    },[userData, userId, setBreadcrumb]);

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    return (
        <Paper>
                <Box p={2}>
                {(userId !== userData.currentAccount.owner)?(
                    success?(
                        <>
                            <Alert severity="success" onClose={() => setSuccess(false)}>User role is successfully updated.</Alert>
                            <Stack direction="row" spacing={1} mt={2}>
                                <Button variant="contained" color="primary" onClick={() => history.push("/account/"+userData.currentAccount.id+"/users")} >Back to User List</Button>
                            </Stack>
                        </>

                    ):(
                        <Stack spacing={3}>
                            {error !== null && 
                                <Alert severity="error">{error}</Alert>
                            }
                            {user === null ? (
                                <Loader text="Loading user details" />
                            ):(
                                <Form handleSubmit={e => {
                                    e.preventDefault();
                                    setError(null);
                                    setSuccess(false);
                                    setInSubmit(true);
                                    const updateAccountUserRole = CloudFunctions.httpsCallable('updateAccountUserRole');
                                    updateAccountUserRole({
                                        accountId: userData.currentAccount.id,
                                        userId: userId,
                                        role: selectedRole
                                    }).then(res => {
                                        setInSubmit(false);
                                        setSuccess(true);
                                    }).catch(err => {
                                        setInSubmit(false);
                                        setError(err.message);
                                    });
                                }}
                                disabled={selectedRole===null || selectedRole===user.role || inSubmit}
                                submitBtnStyle={(selectedRole!=='remove')?"primary":"error"}
                                inSubmit={inSubmit}
                                enableDefaultButtons={true}
                                backToUrl={"/account/"+userData.currentAccount.id+"/users"}
                                >
                                    <Stack spacing={1} mb={5} style={{display: 'inline-block', textAlign: 'center'}}>
                                        <Avatar alt={user.displayName} src={user.photoUrl} sx={{width: 100, height:100, margin: 'auto'}} />
                                        <Typography><strong style={{fontSize: '1.3rem'}}>{user.displayName}</strong></Typography>
                                        <Typography>
                                            Last Login:<br /> {user.lastLoginTime.toLocaleString()}
                                        </Typography>
                                    </Stack>
                                    <FormControl fullWidth>
                                        <InputLabel>Role</InputLabel>
                                        <Select label="Role" defaultValue={user.role} onChange={e => {
                                            setSelectedRole(e.target.value);
                                        }}>
                                            <MenuItem value="user">user</MenuItem>
                                            <MenuItem value="admin">admin</MenuItem>
                                            <MenuItem value="remove"><em>-- Remove Access --</em></MenuItem>
                                        </Select>
                                    </FormControl>
                                </Form>
                            )}
                        </Stack>
                    )
                ):(
                    <>
                        <Alert severity="error">Cannot change account owner role.</Alert>
                        <Stack direction="row" spacing={1} mt={2}>
                            <Button variant="contained" color="primary" onClick={() => history.push("/account/"+userData.currentAccount.id+"/users")} >Back to User List</Button>
                        </Stack>
                    </>
                )}
                </Box>
            </Paper>
    )
}

export default UserRole;