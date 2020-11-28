import React, { useState, useContext, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import Loader from "../../../../components/Loader";
import Alert from "../../../../components/Alert";
import { Link } from "react-router-dom";


const Invite = () => {

    const { code } = useParams();

    const title = 'View Invite';

    const [invite, setInvite] = useState(null); 
    const [error, setError] = useState(null);
    const [inSubmit, setInSubmit] = useState(false);
    const [success, setSuccess] = useState(false);
    const { setBreadcrumb } = useContext(BreadcrumbContext);

    useEffect(() => {
        setBreadcrumb([
            {
                to: "/",
                text: "Home",
                active: false
            },
            {
                to: null,
                text: title,
                active: true
            }
        ]);
        if(code){
            let isSubscribed = true;
            setError(null);
            const getInvite = CloudFunctions.httpsCallable('getInvite');
            getInvite({
                inviteId: code
            }).then(res => {
                if(isSubscribed){
                    setInvite(res.data);
                }
            }).catch(err => {
                if(isSubscribed){
                    setError(err.message);
                }
            });
            return () => (isSubscribed = false);
        }
    }, [code, setBreadcrumb, title])

    return (
        <>
            {success?(
                <Redirect to={"/account/"+invite.accountId+"/"}></Redirect>
            ):(
                <>
                    <div className="container-fluid">
                        <div className="animated fadeIn">
                            <div className="card">
                                <div className="card-header">
                                    {title}
                                </div>
                                <div className="card-body">
                                    {error !== null && 
                                        <Alert type="danger" message={error} dismissible={true} onDismiss={() => setError(null)}></Alert>
                                    }
                                    {invite === null?(
                                        <Loader text="Loading the invite..."></Loader>
                                    ):(
                                        <>
                                            <div className="text-center">This invite will grant you access to <strong>{invite.accountName}</strong>. Do you want to accept it?</div>
                                            <div className="text-center mt-3">
                                                <button className="btn btn-primary mr-2" disabled={inSubmit} onClick={e => {
                                                    e.preventDefault();
                                                    setInSubmit(true);
                                                    const acceptInvite = CloudFunctions.httpsCallable('acceptInvite');
                                                    acceptInvite({
                                                        inviteId: code
                                                    }).then(res => {
                                                        setSuccess(true);
                                                    }).catch(err => {
                                                        setError(err.message);
                                                    });
                                                }}>{inSubmit && <Loader />}
                                                    Yes, accept the invite</button>
                                                <Link className={inSubmit?("btn btn-secondary ml-2 btn-disabled"):("btn btn-secondary ml-2")} to={"/"} onClick={e => {
                                                    if(inSubmit){
                                                        e.preventDefault();
                                                    }
                                                }}>Ignore</Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Invite;