import React, { useState } from "react";
import { Link } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FirebaseAuth } from '../../../components/FirebaseAuth/firebase';
import * as firebase from "firebase/app";
import { userSignIn } from '../../../components/user/functions';

const SignIn = () => {

    const [signInSuccess, setSignInSuccess] = useState(null);

    // Configure FirebaseUI.
    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                userSignIn((result) => {
                    if(result){
                        setSignInSuccess(true);
                        window.location = '/';
                    }else{
                        setSignInSuccess(false);
                    }
                })
                return false;
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
        {signInSuccess &&
            <i className="fa fa-spinner fa-5x fa-spin" />
        }
        {signInSuccess === null &&
            <div className="text-center">
                <i className="fa fa-5x fa-fire text-warning"></i>
                <h2 className="h3 mb-3 font-weight-normal">Please sign in</h2>
                <div id="sign-in" className="SignIn">
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={FirebaseAuth.auth()} />
                </div>
            </div>
        }
        {signInSuccess === false &&
            <div className="text-center">
                <i className="fa fa-5x fa-fire text-warning"></i>
                <h1>Server Error</h1>
                <p>Oops, something went wrong, please try again.</p>
                <Link to="/">Home</Link>
            </div>
        }
        </>
    )
}

export default SignIn;