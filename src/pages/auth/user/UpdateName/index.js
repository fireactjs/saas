import React, { useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { Form, FormResult, Input } from '../../../../components/Form';
import { AuthContext } from '../../../../components/FirebaseAuth';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import { userUpdateName } from '../../../../libs/user';

const UpdateName = () => {
    const title = "Change Your Name";
    const backToUrl = "/user/profile";
    const history = useHistory();

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
                    setInSubmit(true);
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
                    });
                }}
                disabled={fullname.hasError || fullname.value===null || inSubmit}
                inSubmit={inSubmit}
                enableDefaultButtons={true}
                backToUrl={backToUrl}
                >
                    <Input label="Your Name" type="text" name="full-name" maxLen={100} required={true} changeHandler={setFullname} fullWidth variant="outlined" />
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

export default UpdateName;