import React, { useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { Form, FormResult } from '../../../../components/Form';
import { AuthContext } from '../../../../components/FirebaseAuth';
import UserPageLayout from '../../../../components/user/UserPageLayout';

const UpdateEmail = () => {
    const title = "Verify Your Email";
    const backToUrl = "/user/profile";
    const history = useHistory();   

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
                    <div style={{marginTop: '20px', marginBottom: '20px'}}>
                        Send a verification email to <strong>{authUser.user.email}</strong>
                    </div>
                </Form>
            }
            { result.status === null && authUser.user.emailVerified &&
                <FormResult 
                    severity="success"
                    resultMessage={"Your email is already verified."}
                    primaryText="View Profile"
                    primaryAction={() => {
                        history.push(backToUrl);
                    }}
                />
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
                        window.location.href=backToUrl;
                    }}
                />
            }
        </UserPageLayout>
    )
}

export default UpdateEmail;