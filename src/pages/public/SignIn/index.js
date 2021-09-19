import React from "react";
import FirebaseUI from '../../../components/FirebaseUI';
import Logo from "../../../components/Logo";

const SignIn = () => {

    return (
        <div className="text-center">
            <p></p>
            <Logo size="80px" />
            <h2 className="h3 mb-3 font-weight-normal">Please sign in</h2>
            <div className="card-body">
                <FirebaseUI />
            </div>
        </div>
    )
}

export default SignIn;