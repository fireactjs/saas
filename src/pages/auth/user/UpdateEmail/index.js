import React from "react";
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
                                    <Input type="email" name="email-address" />
                                </Field>
                                <Field label="Re-enter Password">
                                    <Input type="password" name="password" />
                                </Field>
                                <Field>
                                    <button className="btn btn-primary mr-2">Submit</button>
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