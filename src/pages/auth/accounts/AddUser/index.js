import React, { useContext, useEffect, useState } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import {Form, Input} from "../../../../components/Form";
import { Link } from "react-router-dom";
import Loader from "../../../../components/Loader";
import { Paper, Box, Alert, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const AddUser = () => {
    const title = 'Add User';

    const { userData } = useContext(AuthContext);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    const [emailAddress, setEmailAddress] = useState({
        hasError: false,
        error: null,
        value: null
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [inSubmit, setInSubmit] = useState(false);
    const [selectedRole, setSelectedRole] = useState('user');
    const [inviteDialog, setInviteDialog] = useState(false);

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
    }, [userData, setBreadcrumb, title]);

    return (
        <>
            <Paper>
                <Box p={2}>
                {success?(
                    <>
                        {inviteDialog?(
                                <Alert severity="success">The invite is sent to the email address.</Alert>
                            ):(
                                <Alert severity="success">The user is added to the account.</Alert>
                            )}
                        </>
                    ):(
                        <>
                            {error !== null && 
                                <Alert severity="error">{error}</Alert>
                            }
                            {inviteDialog?(
                                <>
                                    <div className="text-center">The email is not registered by any existing user. Do you want to send an invite to the user?</div>
                                    <div className="text-center mt-3">
                                        <button className="btn btn-primary mr-2" disabled={inSubmit} onClick={e => {
                                            e.preventDefault();
                                            setInSubmit(true);
                                            const inviteEmailToAccount = CloudFunctions.httpsCallable('inviteEmailToAccount');
                                            inviteEmailToAccount({
                                                accountId: userData.currentAccount.id,
                                                email: emailAddress.value,
                                                role: selectedRole
                                            }).then(res => {
                                                setInSubmit(false);
                                                setSuccess(true);
                                            }).catch(err => {
                                                setError(err.message);
                                            });
                                        }}>{inSubmit && <Loader />}
                                            Yes, send an invite</button>
                                        <Link className={inSubmit?("btn btn-secondary ml-2 btn-disabled"):("btn btn-secondary ml-2")} disabled={inSubmit} to={"/account/"+userData.currentAccount.id+"/users"} onClick={e => {
                                            if(inSubmit){
                                                e.preventDefault();
                                            }
                                        }}>No</Link>
                                    </div>
                                </>
                            ):(
                                <Form handleSubmit={e => {
                                    e.preventDefault();
                                    setError(null);
                                    setSuccess(false);
                                    setInSubmit(true);
                                    const addUserToAccount = CloudFunctions.httpsCallable('addUserToAccount');
                                    addUserToAccount({
                                        accountId: userData.currentAccount.id,
                                        email: emailAddress.value,
                                        role: selectedRole
                                    }).then(res => {
                                        setInSubmit(false);
                                        setSuccess(true);
                                    }).catch(err => {
                                        setInSubmit(false);
                                        if(err.details && err.details.code === 'auth/user-not-found'){
                                            setInviteDialog(true);
                                            setInSubmit(false);
                                        }else{
                                            setError(err.message);
                                        }
                                    });
                                }}
                                disabled={emailAddress.hasError || emailAddress.value===null || selectedRole===null || inSubmit}
                                submitBtnStyle={(selectedRole!=='remove')?"primary":"danger"}
                                inSubmit={inSubmit}
                                enableDefaultButtons={true}
                                backToUrl={"/account/"+userData.currentAccount.id+"/users"}
                                >

                                    <Input label="Email Address" type="email" name="email-address" hasError={emailAddress.hasError} error={emailAddress.error} minLen={5} maxLen={50} required={true} validRegex="^[a-zA-Z0-9-_+\.]*@[a-zA-Z0-9-_\.]*\.[a-zA-Z0-9-_\.]*$" changeHandler={setEmailAddress} fullWidth />
                                    <FormControl fullWidth>
                                        <InputLabel>Role</InputLabel>
                                        <Select label="Role" value={selectedRole} onChange={e => {
                                            setSelectedRole(e.target.value);
                                        }}>
                                            <MenuItem value="user">user</MenuItem>
                                            <MenuItem value="admin">admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Form>
                            )}
                        </>
                    )}                    
                </Box>
            </Paper>
        </>

    )
}

export default AddUser;