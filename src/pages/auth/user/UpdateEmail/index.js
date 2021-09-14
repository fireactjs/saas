import React, { useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { Form, FormResult, Input } from '../../../../components/Form';
import firebase from "firebase/app";
import { FirebaseAuth } from '../../../../components/FirebaseAuth/firebase';
import { AuthContext } from '../../../../components/FirebaseAuth';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import { log, UPDATE_EMAIL } from '../../../../libs/log';

const UpdateEmail = () => {
    const title = "Change Your Email";
    const backToUrl = "/user/profile";
    const history = useHistory();    

    const [emailAddress, setEmailAddress] = useState({
        hasError: false,
        error: null,
        value: null
    });
    const [password, setPassword] = useState({
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
                    // check password
                    const credential = firebase.auth.EmailAuthProvider.credential(
                        FirebaseAuth.auth().currentUser.email,
                        password.value
                    )
                    // update email address
                    authUser.user.reauthenticateWithCredential(credential)
                    .then(() => {
                        authUser.user.updateEmail(emailAddress.value).then(() => {
                            authUser.user.sendEmailVerification().then(() => {
                                log(UPDATE_EMAIL);
                                setResult({
                                    status: true,
                                    message: 'Your email address has been updated. Please check your email inbox to verify the email address.'
                                });
                                setInSubmit(false);
                            }).catch(() => {
                                setResult({
                                    status: true,
                                    message: 'Your email address has been updated. Please verify your email.'
                                });
                                setInSubmit(false);
                            })
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
                        })
                        setInSubmit(false);
                    })
                }}
                disabled={emailAddress.hasError || password.hasError || emailAddress.value===null || password.value===null || inSubmit}
                inSubmit={inSubmit}
                enableDefaultButtons={true}
                backToUrl="/user/profile"
                >
                    <Input label="Email Address" type="email" name="email-address" hasError={emailAddress.hasError} error={emailAddress.error} minLen={5} maxLen={50} required={true} validRegex="^[a-zA-Z0-9-_+\.]*@[a-zA-Z0-9-_\.]*\.[a-zA-Z0-9-_\.]*$" changeHandler={setEmailAddress} fullWidth variant="outlined" />
                    <Input label="Current Password" type="password" name="password" hasError={password.hasError} error={password.error} required={true} changeHandler={setPassword} fullWidth variant="outlined" />
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
                    secondaryAction={(e) => {
                        e.preventDefault();
                        history.push(backToUrl);
                    }}
                />
            }
            { result.status === true &&
                <FormResult 
                    severity="success"
                    resultMessage={result.message}
                    primaryText="View Profile"
                    primaryAction={(e) => {
                        e.preventDefault();
                        history.push(backToUrl);
                    }}
                />
            }
        </UserPageLayout>
    )
}

export default UpdateEmail;