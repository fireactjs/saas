import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { Form, Field, Input } from '../../../../components/Form';
import { AuthContext } from '../../../../components/FirebaseAuth';
import Alert from '../../../../components/Alert';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import { userUpdateName } from '../../../../libs/user';

const UpdateName = () => {
    const title = "Change Your Name";
    

    const [fullname, setFullname] = useState({
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
                    authUser.user.updateProfile({
                        displayName: fullname.value
                    }).then(() => {
                        userUpdateName();
                        setResult({
                            status: true,
                            message: 'Your name has been updated.'
                        });
                        setInSubmit(false);
                    }).catch(err => {
                        setResult({
                            status: false,
                            message: err.message
                        });
                        setInSubmit(false);
                    })
                }}
                disabled={fullname.hasError || fullname.value===null || inSubmit}
                inSubmit={inSubmit}
                enableDefaultButtons={true}
                backToUrl="/user/profile"
                >
                    <Field label="Your Name">
                        <Input type="text" name="full-name" maxLen={100} required={true} changeHandler={setFullname} />
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

export default UpdateName;