import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumb';
import { Form, Field, Input } from '../../../../components/Form';
import * as firebase from "firebase/app";
import { FirebaseAuth } from '../../../../components/FirebaseAuth/firebase';
import { AuthContext } from '../../../../components/FirebaseAuth';

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
                            <Form handleSubmit={e => {
                                e.preventDefault();
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
                                            console.log('success');
                                        }).catch(err => {
                                            console.log(err);
                                        })
                                    }).catch(err => {
                                        console.log(err);
                                    })
                                }).catch(() => {
                                    setPassword({
                                        hasError: true,
                                        error: 'Incorrect password, authentication failed.',
                                        value: password.value
                                    })
                                })
                            }} >
                                <Field label="Email Address">
                                    <Input type="email" name="email-address" hasError={emailAddress.hasError} error={emailAddress.error} minLen={5} maxLen={50} required={true} validRegex="^[a-zA-Z0-9-_+\.]*@[a-zA-Z0-9-_\.]*\.[a-zA-Z0-9-_\.]*$" changeHandler={setEmailAddress} />
                                </Field>
                                <Field label="Re-enter Password">
                                    <Input type="password" name="password" hasError={password.hasError} error={password.error} required={true} changeHandler={setPassword} />
                                </Field>
                                <Field>
                                    <button className="btn btn-primary mr-2" disabled={(emailAddress.hasError || password.hasError || emailAddress.value===null || password.value===null ?'disabled':'')}>Submit</button>
                                    <Link className="btn btn-secondary" to="/user/profile">Back</Link>
                                </Field>
                            </Form>
                        </div>
                    </div>
                   
                </div>
            </div>
        </>

    )
}

export default UpdateEmail;