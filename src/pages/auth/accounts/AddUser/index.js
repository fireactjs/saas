import React, { useContext, useEffect, useState } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import Alert from "../../../../components/Alert";
import {Form, Field, Input} from "../../../../components/Form";
import { Link } from "react-router-dom";
import Loader from "../../../../components/Loader";

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
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="card">
                        <div className="card-header">
                            {title}
                        </div>
                        <div className="card-body">
                            {success?(
                                <>
                                    {inviteDialog?(
                                        <Alert type="success" message="The invite is sent to the email address." dismissible={false} onDismiss={() => setSuccess(false)}></Alert>
                                    ):(
                                        <Alert type="success" message="The user is added to the account." dismissible={false} onDismiss={() => setSuccess(false)}></Alert>
                                    )}
                                </>
                            ):(
                                <>
                                    {error !== null && 
                                        <Alert type="danger" message={error} dismissible={true} onDismiss={() => setError(null)}></Alert>
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
                                            <Field label="Email Address">
                                                <Input type="email" name="email-address" hasError={emailAddress.hasError} error={emailAddress.error} minLen={5} maxLen={50} required={true} validRegex="^[a-zA-Z0-9-_+\.]*@[a-zA-Z0-9-_\.]*\.[a-zA-Z0-9-_\.]*$" changeHandler={setEmailAddress} />
                                            </Field>
                                            <Field label="Role">
                                                <select className="form-control col-md-6 col-sm-8" onChange={e => {
                                                    setSelectedRole(e.target.value);
                                                }}>
                                                    <option value="user">user</option>
                                                    <option value="admin">admin</option>
                                                </select>
                                            </Field>
                                        </Form>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default AddUser;