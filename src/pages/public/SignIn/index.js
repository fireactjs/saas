import React, { useState } from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FirebaseAuth } from '../../../components/FirebaseAuth/firebase';
import * as firebase from "firebase/app";

const SignIn = () => {
    const [signInSuccess, setSignInSuccess] = useState(false);

    // Configure FirebaseUI.
    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                setSignInSuccess(true);
                return true;
            }
        },
        signInSuccessUrl: '/',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ]
    };

    return (
        <>
        {signInSuccess?(
            <i className="fa fa-spinner fa-5x fa-spin" />
        ):(
        <div className="text-center">
            <i className="fa fa-5x fa-fire text-warning"></i>
            <h2 className="h3 mb-3 font-weight-normal">Please sign in</h2>
            <div id="sign-in" className="SignIn">
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={FirebaseAuth.auth()} />
            </div>
        </div>
        )}  
    </>
    )
}

export default SignIn;