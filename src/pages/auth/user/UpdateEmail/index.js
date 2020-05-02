import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumb';
import { Form, Field, Input } from '../../../../components/Form';

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
        value: null
    });
    const [password, setPassword] = useState({
        hasError: false,
        value: null
    });

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
                            <Form handleSubmit={() => {

                            }} >
                                <Field label="Email Address">
                                    <Input type="email" name="email-address" minLen={5} maxLen={50} required={true} validRegex="^[a-zA-Z0-9-_+\.]*@[a-zA-Z0-9-_\.]*\.[a-zA-Z0-9-_\.]*$" changeHandler={setEmailAddress} />
                                </Field>
                                <Field label="Re-enter Password">
                                    <Input type="password" name="password" required={true} changeHandler={setPassword} />
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