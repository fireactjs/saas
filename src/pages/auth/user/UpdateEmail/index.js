import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumb';
import { Form, Field, Input } from '../../../../components/Form';
import * as firebase from "firebase/app";
import { FirebaseAuth } from '../../../../components/FirebaseAuth/firebase';
import { AuthContext } from '../../../../components/FirebaseAuth';
import Loader from '../../../../components/Loader';
import Alert from '../../../../components/Alert';

const UpdateEmail = () => {
    const title = "Change Your Email";
    const breadcrumbLinks = [
        {
            to: "/",
            text: "Home",
            active: false
        },
        {
            to: "/user/profile",
            text: "User",
            active: false
        },
        {
            to: null,
            text: title,
            active: true
        }
    ];

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
        <>
            <Breadcrumb links={breadcrumbLinks} />
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="card">
                        <div className="card-header">
                            {title}
                        </div>
                        <div className="card-body">
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
                                }} >
                                    <Field label="Email Address">
                                        <Input type="email" name="email-address" hasError={emailAddress.hasError} error={emailAddress.error} minLen={5} maxLen={50} required={true} validRegex="^[a-zA-Z0-9-_+\.]*@[a-zA-Z0-9-_\.]*\.[a-zA-Z0-9-_\.]*$" changeHandler={setEmailAddress} />
                                    </Field>
                                    <Field label="Re-enter Password">
                                        <Input type="password" name="password" hasError={password.hasError} error={password.error} required={true} changeHandler={setPassword} />
                                    </Field>
                                    <Field>
                                        <button className="btn btn-primary mr-2" disabled={(emailAddress.hasError || password.hasError || emailAddress.value===null || password.value===null || inSubmit ?'disabled':'')}>
                                            {inSubmit && 
                                                <Loader />
                                            }
                                            Submit
                                        </button>
                                        <Link className={"btn btn-secondary"+(inSubmit?" disabled":"")} to="/user/profile">Back</Link>
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
                                    <Link className="btn btn-secondary" to="/user/profile">Back</Link>
                                </>
                            }
                            { result.status === true &&
                                <>
                                    <Alert type="success" dismissible={false} message={result.message} />
                                    <Link className="btn btn-primary" to="/user/profile">View Profile</Link>
                                </>
                            }
                        </div>
                    </div>
                   
                </div>
            </div>
        </>

    )
}

export default UpdateEmail;