import React, { useState, useContext, useEffect, createRef } from "react";
import { Link } from 'react-router-dom';
import { Form, Field, Input } from '../../../../components/Form';
import firebase from "firebase/app";
import { AuthContext } from '../../../../components/FirebaseAuth';
import Alert from '../../../../components/Alert';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import { log, UPDATE_PHONE } from '../../../../libs/log';

const UpdatePhone = () => {
    const title = "Change Your Phone Number";

    const [phoneNumber, setPhoneNumber] = useState({
        hasError: false,
        error: null,
        value: null
    });

    const [verificationCode, setVerificationCode] = useState({
        hasError: false,
        error: null,
        value: null
    });

    const { authUser } = useContext(AuthContext);

    const SUCCESS = 'success';
    const FAILURE = 'failure';
    const PHONESTEP = 'phone';
    const VERIFYSTEP = 'verify';

    const [result, setResult] = useState({
        status: PHONESTEP,
        message: ''
    });

    const [inSubmit, setInSubmit] = useState(false);

    let recaptcha = createRef();
    const [recaptchaVerified, setRecaptchaVerified] = useState(false);
    const [verificationId, setVerificationId] = useState('');

    useEffect(() => {
        if(result.status===PHONESTEP){
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(recaptcha, {
                'size': 'normal',
                'callback': function (response) {
                    setRecaptchaVerified(true);
                },
                'expired-callback': function () {
                    setRecaptchaVerified(false);
                }
            });
            window.recaptchaVerifier.render().then(function (widgetId) {
                window.recaptchaWidgetId = widgetId;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[result]);  

    return (
        <UserPageLayout title={title} >
            { result.status === PHONESTEP &&
                <Form handleSubmit={e => {
                    e.preventDefault();
                    setInSubmit(true);
                    setRecaptchaVerified(false);
                    var provider = new firebase.auth.PhoneAuthProvider();
                    provider.verifyPhoneNumber(
                        phoneNumber.value,
                        window.recaptchaVerifier
                    ).then(vid => {
                        setRecaptchaVerified(true);
                        setVerificationId(vid);
                        setResult({
                            status: VERIFYSTEP,
                            message: ''
                        });
                        setInSubmit(false);    
                    }).catch(err => {
                        setPhoneNumber({
                            hasError: true,
                            error: err.message,
                            value: phoneNumber.value
                        })
                        setInSubmit(false);
                    })          
                }}
                disabled={phoneNumber.hasError || phoneNumber.value===null || !recaptchaVerified || inSubmit}
                inSubmit={inSubmit}
                enableDefaultButtons={true}
                backToUrl="/user/profile"
                >
                    <Field label="Phone Number">
                        <Input type="text" name="phone-number" hasError={phoneNumber.hasError} error={phoneNumber.error} required={true} changeHandler={setPhoneNumber} />
                    </Field>
                    <Field label="">
                        <div ref={(ref)=>recaptcha=ref}></div>
                    </Field>
                </Form>
            }
            { result.status === VERIFYSTEP && 
                <Form handleSubmit={e => {
                    e.preventDefault();
                    setInSubmit(true);
                    var cred = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode.value);
                    authUser.user.updatePhoneNumber(cred).then(() => {
                        log(UPDATE_PHONE);
                        setResult({
                            status: SUCCESS,
                            message: 'Your phone number has been updated.'
                        });
                        setInSubmit(false);
                    }).catch(err => {
                        setResult({
                            status: FAILURE,
                            message: err.message
                        })
                        setInSubmit(false);
                    });
                }}
                disabled={verificationCode.hasError || verificationCode.value===null || !recaptchaVerified || inSubmit}
                inSubmit={inSubmit}
                enableDefaultButtons={true}
                backToUrl="/user/profile"
                >
                    <Field label="Verification Code">
                        <Input type="text" name="verification-code" hasError={verificationCode.hasError} error={verificationCode.error} required={true} changeHandler={setVerificationCode} />
                    </Field>
                </Form>
            }
            { result.status === FAILURE &&
                <>
                    <Alert type="danger" dismissible={false} message={result.message} />
                    <button className="btn btn-primary mr-2" onClick={() => {
                        setResult({
                            status: PHONESTEP,
                            message: ''
                        })
                    }} >Try Again</button>
                    <Link className="btn btn-secondary" to="/user/profile">View Profile</Link>
                </>
            }
            { result.status === SUCCESS &&
                <>
                    <Alert type="success" dismissible={false} message={result.message} />
                    <Link className="btn btn-primary" to="/user/profile">View Profile</Link>
                </>
            }
        </UserPageLayout>
    )
}

export default UpdatePhone;