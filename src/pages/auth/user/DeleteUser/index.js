import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { Form, Field, Input } from '../../../../components/Form';
import { AuthContext } from '../../../../components/FirebaseAuth';
import Alert from '../../../../components/Alert';
import UserPageLayout from '../../../../components/user/UserPageLayout';

const DeleteUser = () => {
    const title = "Delete Your Account";
    

    const [emailAddress, setEmailAddress] = useState({
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
                    if(emailAddress.value === authUser.user.email){
                        authUser.user.delete().then(() => {
                            setResult({
                                status: true,
                                message: 'Your account has been deleted.'
                            });
                            setInSubmit(false);
                        }).catch(err => {
                            setResult({
                                status: false,
                                message: err.message
                            });
                            setInSubmit(false);
                        });
                    }else{
                        setEmailAddress({
                            hasError: true,
                            error: 'The email address does not match your email address.',
                            value: emailAddress.value
                        })
                        setInSubmit(false);
                    }
                }}
                submitBtnText='DELETE'
                submitBtnStyle='danger'
                disabled={emailAddress.hasError || emailAddress.value===null || inSubmit}
                inSubmit={inSubmit}
                enableDefaultButtons={true}
                backToUrl="/user/profile"
                >
                    <Field label="Confirm Your Email">
                        <Input type="email" name="email-address" hasError={emailAddress.hasError} error={emailAddress.error} minLen={5} maxLen={50} required={true} validRegex="^[a-zA-Z0-9-_+\.]*@[a-zA-Z0-9-_\.]*\.[a-zA-Z0-9-_\.]*$" changeHandler={setEmailAddress} />
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

export default DeleteUser;