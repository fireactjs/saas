import React, { useState, useContext, useEffect, createRef } from "react";
import { useHistory } from 'react-router-dom';
import { Form, FormResult, Input } from '../../../../components/Form';
import firebase from "firebase/app";
import { AuthContext } from '../../../../components/FirebaseAuth';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import { log, UPDATE_PHONE } from '../../../../libs/log';

const UpdatePhone = () => {
    const title = "Change Your Phone Number";
    const backToUrl = "/user/profile";
    const history = useHistory();

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
                    <Input label="Phone Number" type="text" name="phone-number" hasError={phoneNumber.hasError} error={phoneNumber.error} required={true} changeHandler={setPhoneNumber} fullWidth variant="outlined" />
                    <div style={{marginTop:'20px',marginBottom:'20px'}}>
                        <div ref={(ref)=>recaptcha=ref}></div>
                    </div>
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
                    <Input label="Verification Code" type="text" name="verification-code" hasError={verificationCode.hasError} error={verificationCode.error} required={true} changeHandler={setVerificationCode} fullWidth variant="outlined" />
                </Form>
            }
            { result.status === FAILURE &&
                <FormResult 
                    severity="error"
                    resultMessage={result.message}
                    primaryText="Try Again"
                    primaryAction={() => {
                        setResult({
                            status: PHONESTEP,
                            message: ''
                        })
                    }}
                    secondaryText="View Profile"
                    secondaryAction={() => {
                        history.push(backToUrl);
                    }}
                />
            }
            { result.status === SUCCESS &&
                <FormResult 
                    severity="success"
                    resultMessage={result.message}
                    primaryText="View Profile"
                    primaryAction={(e) => {
                        history.push(backToUrl);
                    }}
                />
            }
        </UserPageLayout>
    )
}

export default UpdatePhone;