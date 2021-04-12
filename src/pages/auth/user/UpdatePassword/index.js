import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { Form, Field, Input } from '../../../../components/Form';
import firebase from "firebase/app";
import { FirebaseAuth } from '../../../../components/FirebaseAuth/firebase';
import { AuthContext } from '../../../../components/FirebaseAuth';
import Alert from '../../../../components/Alert';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import { log, UPDATE_PASSWORD } from '../../../../libs/log';

const UpdatePassword = () => {
    const title = "Change Your Password";
    
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
                            FirebaseAuth.auth().currentUser.updatePassword(newPassword.value)
                            .then(() => {
                                log(UPDATE_PASSWORD);
                                setResult({
                                    status: true,
                                    message: 'Your password has been updated.'
                                });
                                setInSubmit(false);
                            }).catch(err => {
                                setResult({
                                    status: false,
                                    message: err.message
                                });
                                setInSubmit(false);
                            })
                        }).catch(() => {
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
                    <Field label="Current Password">
                        <Input type="password" name="password" hasError={password.hasError} error={password.error} required={true} changeHandler={setPassword} />
                    </Field>
                    <Field label="New Password">
                        <Input type="password" name="newPassword" hasError={newPassword.hasError} error={newPassword.error} required={true} minLen={6} maxLen={20} changeHandler={setNewPassword} />
                    </Field>
                    <Field label="Confirm Password">
                        <Input type="password" name="confirmPassword" hasError={confirmPassword.hasError} error={confirmPassword.error} required={true} minLen={6} maxLen={20} changeHandler={setConfirmPassword} />
                    </Field>
                </Form>
            }
            { result.status === false &&
                <>
                    <Alert type="danger" dismissible={false} message={result.message} />
                    <button className="btn btn-primary mr-2" onClick={() => {
                        setResult({
                            status: null,
                            message: ''
                        })
                    }} >Try Again</button>
                    <Link className="btn btn-secondary" to="/user/profile">View Profile</Link>
                </>
            }
            { result.status === true &&
                <>
                    <Alert type="success" dismissible={false} message={result.message} />
                    <Link className="btn btn-primary" to="/user/profile">View Profile</Link>
                </>
            }
        </UserPageLayout>
    )
}

export default UpdatePassword;