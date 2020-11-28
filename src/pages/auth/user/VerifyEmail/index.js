import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { Form, Field } from '../../../../components/Form';
import { AuthContext } from '../../../../components/FirebaseAuth';
import Alert from '../../../../components/Alert';
import UserPageLayout from '../../../../components/user/UserPageLayout';

const UpdateEmail = () => {
    const title = "Verify Your Email";

    const { authUser } = useContext(AuthContext);

    const [result, setResult] = useState({
        status: null,
        message: ''
    });

    const [inSubmit, setInSubmit] = useState(false);

    return (
        <UserPageLayout title={title} >
            { result.status === null && !authUser.user.emailVerified &&
                <Form handleSubmit={e => {
                    e.preventDefault();
                    setInSubmit(true);
                    authUser.user.sendEmailVerification().then(() => {
                        setResult({
                            status: true,
                            message: 'Please check your email inbox to verify the email address. Refresh this page after you verified your email address.'
                        });
                        setInSubmit(false);
                    }).catch((err) => {
                        setResult({
                            status: false,
                            message: err.message
                        });
                        setInSubmit(false);
                    })
                }}
                disabled={inSubmit}
                inSubmit={inSubmit}
                enableDefaultButtons={true}
                backToUrl="/user/profile"
                >
                    <Field label="Email Address">
                        <input type="text" readOnly className="form-control-plaintext" value={authUser.user.email} ></input>
                    </Field>
                </Form>
            }
            { result.status === null && authUser.user.emailVerified &&
                <>
                    <Alert type="success" dismissible={false} message="Your email is already verified." />
                    <Link className="btn btn-primary" to="/user/profile">View Profile</Link>
                </>
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