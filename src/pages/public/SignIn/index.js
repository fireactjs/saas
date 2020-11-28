import React from "react";
import FirebaseUI from '../../../components/FirebaseUI';

const SignIn = () => {

    return (
        <>
            <div className="col-md-3"></div>
        
            <div className="text-center col-md-6">
                <div className="card">
                    <p></p>
                    <i className="fa fa-5x fa-fire text-warning"></i>
                    <h2 className="h3 mb-3 font-weight-normal">Please sign in</h2>
                    <div className="card-body">
                        <FirebaseUI />
                    </div>
                </div>
            </div>

            <div className="col-md-3"></div>
        </>
    )
}

export default SignIn;