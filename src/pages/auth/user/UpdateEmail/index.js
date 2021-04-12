import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { Form, Field, Input } from '../../../../components/Form';
import firebase from "firebase/app";
import { FirebaseAuth } from '../../../../components/FirebaseAuth/firebase';
import { AuthContext } from '../../../../components/FirebaseAuth';
import Alert from '../../../../components/Alert';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import { log, UPDATE_EMAIL } from '../../../../libs/log';

const UpdateEmail = () => {
    const title = "Change Your Email";
    

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
                    <Field label="Email Address">
                        <Input type="email" name="email-address" hasError={emailAddress.hasError} error={emailAddress.error} minLen={5} maxLen={50} required={true} validRegex="^[a-zA-Z0-9-_+\.]*@[a-zA-Z0-9-_\.]*\.[a-zA-Z0-9-_\.]*$" changeHandler={setEmailAddress} />
                    </Field>
                    <Field label="Current Password">
                        <Input type="password" name="password" hasError={password.hasError} error={password.error} required={true} changeHandler={setPassword} />
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

export default UpdateEmail;