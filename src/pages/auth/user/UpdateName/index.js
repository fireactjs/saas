import React, { useState, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { Form, Input } from '../../../../components/Form';
import { AuthContext } from '../../../../components/FirebaseAuth';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import { userUpdateName } from '../../../../libs/user';
import { Alert } from "@material-ui/lab";
import { Button } from "@material-ui/core";

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

    const history = useHistory();

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
                    <Input label="Your Name" type="text" name="full-name" maxLen={100} required={true} changeHandler={setFullname} fullWidth variant="outlined" />
                </Form>
            }
            { result.status === false &&
                <>
                    <Alert severity="error">{result.message}</Alert>
                    <p></p>
                    <button className="btn btn-primary mr-2" onClick={() => {
                        setResult({
                            status: null,
                            message: ''
                        })
                    }} >Try Again</button>
                    <Button variant="contained" onClick={(e) => {
                        e.preventDefault();
                        history.push("/user/profile");
                    }}>View Profile</Button>
                </>
            }
            { result.status === true &&
                <>
                    <Alert severity="success">{result.message}</Alert>
                    <p></p>
                    <Button variant="contained" onClick={(e) => {
                        e.preventDefault();
                        history.push("/user/profile");
                    }}>View Profile</Button>
                </>
            }
        </UserPageLayout>
    )
}

export default UpdateName;