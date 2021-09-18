import React, { useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { Form, FormResult, Input } from '../../../../components/Form';
import { AuthContext } from '../../../../components/FirebaseAuth';
import UserPageLayout from '../../../../components/user/UserPageLayout';

const DeleteUser = () => {
    const title = "Delete Your Account";
    const backToUrl = "/user/profile";
    const history = useHistory();     

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
                submitBtnStyle='error'
                disabled={emailAddress.hasError || emailAddress.value===null || inSubmit}
                inSubmit={inSubmit}
                enableDefaultButtons={true}
                backToUrl="/user/profile"
                >
                    <Input label="Confirm Your Email" type="email" name="email-address" hasError={emailAddress.hasError} error={emailAddress.error} minLen={5} maxLen={50} required={true} validRegex="^[a-zA-Z0-9-_+\.]*@[a-zA-Z0-9-_\.]*\.[a-zA-Z0-9-_\.]*$" changeHandler={setEmailAddress} fullWidth variant="outlined" />
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
                    secondaryAction={() => {
                        history.push(backToUrl);
                    }}
                />
            }
            { result.status === true &&
                <FormResult 
                    severity="success"
                    resultMessage={result.message}
                    primaryText="View Profile"
                    primaryAction={() => {
                        history.push(backToUrl);
                    }}
                />
            }
        </UserPageLayout>
    )
}

export default DeleteUser;