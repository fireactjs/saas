import React, { useState } from "react";
import { Link } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FirebaseAuth } from '../FirebaseAuth/firebase';
import firebase from "firebase/app";
import { userSignIn } from '../../libs/user';
import Loader from "../Loader";
import Logo from "../Logo";

const FirebaseUI = () => {

    const params = (new URL(document.location)).searchParams;
    const re = params.get('re');
    if(re && re.indexOf('/') === 0){
        localStorage.setItem('re', re);
    }

    const [signInSuccess, setSignInSuccess] = useState(null);

    // Configure FirebaseUI.
    const uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                userSignIn((result) => {
                    if(result){
                        setSignInSuccess(true);
                        const to = localStorage.getItem('re');
                        localStorage.removeItem('re');
                        if(to && to.indexOf('/') === 0){
                            window.location = to;
                        }else{
                            window.location = '/';
                        }
                    }else{
                        setSignInSuccess(false);
                    }
                })
                return false;
            },
            uiShown: function(){
                document.getElementById('loader').style.display = 'none';
            }
        },
        signInSuccessUrl: '/',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ]
    };

    return (
        <>
        {signInSuccess &&
            <Loader size={50} text={"Loading..."}/>
        }
        {signInSuccess === null &&
            <>
                <div id="sign-in" className="SignIn">
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={FirebaseAuth.auth()} />
                </div>
                <div id="loader">
                    <Loader size={50} />
                </div>
            </>
        }
        {signInSuccess === false &&
            <div className="text-center">
                <Logo size="80px" />
                <h1>Server Error</h1>
                <p>Oops, something went wrong, please try again.</p>
                <Link to="/">Home</Link>
            </div>
        }
        </>
    );
}

export default FirebaseUI;