import React, { useState, useContext, useEffect, useRef } from "react";
import { useHistory } from 'react-router-dom';
import { Form, FormResult, Input } from '../../../../components/Form';
import firebase from "firebase/app";
import { FirebaseAuth } from '../../../../components/FirebaseAuth/firebase';
import { AuthContext } from '../../../../components/FirebaseAuth';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import { log, UPDATE_PASSWORD } from '../../../../libs/log';

const UpdatePassword = () => {
    const title = "Change Your Password";
    const backToUrl = "/user/profile";
    const history = useHistory(); 
    const mountedRef = useRef(true);  
    
    const [password, setPassword] = useState({
        hasError: false,
        error: null,
        value: null
    });

    const [newPassword, setNewPassword] = useState({
        hasError: false,
        error: null,
        value: null
    });

    const [confirmPassword, setConfirmPassword] = useState({
        hasError: false,
        error: null,
        value: null
    });

    const { authUser } = useContext(AuthContext);

    const [result, setResult] = useState({
        status: null,
        message: ''
    });

    const [inSubmit, setInSubmit] = useState(false);

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    return (
        <UserPageLayout title={title} >
            { result.status === null &&
                <Form handleSubmit={e => {
                    e.preventDefault();
                    setInSubmit(true);
                    if(newPassword.value !== confirmPassword.value){
                        setConfirmPassword({
                            hasError: true,
                            error: 'The confirm password does not match with the new password.',
                            value: password.value
                        });
                        setInSubmit(false);
                    }else{
                        // check password
                        const credential = firebase.auth.EmailAuthProvider.credential(
                            FirebaseAuth.auth().currentUser.email,
                            password.value
                        )
                        // update email address
                        authUser.user.reauthenticateWithCredential(credential)
                        .then(() => {
                            if (!mountedRef.current) return null
                            FirebaseAuth.auth().currentUser.updatePassword(newPassword.value)
                            .then(() => {
                                if (!mountedRef.current) return null
                                log(UPDATE_PASSWORD);
                                setResult({
                                    status: true,
                                    message: 'Your password has been updated.'
                                });
                                setInSubmit(false);
                            }).catch(err => {
                                if (!mountedRef.current) return null
                                setResult({
                                    status: false,
                                    message: err.message
                                });
                                setInSubmit(false);
                            })
                        }).catch(() => {
                            if (!mountedRef.current) return null
                            setPassword({
                                hasError: true,
                                error: 'Incorrect password, authentication failed.',
                                value: password.value
                            });
                            setInSubmit(false);
                        })
                    }
                }}
                disabled={password.hasError || newPassword.hasError || confirmPassword.hasError || password.value===null || newPassword.value===null || confirmPassword.value===null || inSubmit}
                inSubmit={inSubmit}
                enableDefaultButtons={true}
                backToUrl="/user/profile"
                >
                    <Input label="Current Password" type="password" name="password" hasError={password.hasError} error={password.error} required={true} changeHandler={setPassword} fullWidth variant="outlined" />
                    <Input label="New Password" type="password" name="newPassword" hasError={newPassword.hasError} error={newPassword.error} required={true} minLen={6} maxLen={20} changeHandler={setNewPassword} fullWidth variant="outlined" />
                    <Input label="Confirm Password" type="password" name="confirmPassword" hasError={confirmPassword.hasError} error={confirmPassword.error} required={true} minLen={6} maxLen={20} changeHandler={setConfirmPassword} fullWidth variant="outlined" />
                </Form>
            }
            { result.status === false &&
                <FormResult 
                    severity="error"
                    resultMessage={result.message}
                    primaryText="Try Again"
                    primaryAction={() => {
                        setResult({
                            status: null,
                            message: ''
                        })
                    }}
                    secondaryText="View Profile"
                    secondaryAction={() => {
                        history.push(backToUrl);
                    }}
                />
            }
            { result.status === true &&
                <FormResult 
                    severity="success"
                    resultMessage={result.message}
                    primaryText="View Profile"
                    primaryAction={() => {
                        history.push(backToUrl);
                    }}
                />
            }
        </UserPageLayout>
    )
}

export default UpdatePassword;