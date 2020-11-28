import React, { useContext, useEffect, useState } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import Alert from "../../../../components/Alert";
import { Link, Redirect } from "react-router-dom";
import Loader from "../../../../components/Loader";
import { currency } from "../../../../inc/currency.json";

const DeleteAccount = () => {
    const title = 'Delete Account';

    const { userData } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [inSubmit, setInSubmit] = useState(false);
    const { setBreadcrumb } = useContext(BreadcrumbContext);

    useEffect(() => {
        setBreadcrumb([
            {
                to: "/",
                text: "Home",
                active: false
            },
            {
                to: "/account/"+userData.currentAccount.id+"/",
                text: userData.currentAccount.name,
                active: false
            },
            {
                to: "/account/"+userData.currentAccount.id+"/billing",
                text: 'Billing',
                active: false
            },
            {
                to: null,
                text: title,
                active: true
            }
        ]);
    },[userData,setBreadcrumb,title])

    return (
        <>
            {success?(
                <Redirect to="/"></Redirect>
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
                                        <p>Your current subscription period will end on {(new Date(userData.currentAccount.subscriptionCurrentPeriodEnd * 1000)).toLocaleDateString()}. The system will charge {currency[userData.currentAccount.currency].sign}{userData.currentAccount.price}/{userData.currentAccount.paymentCycle} to renew the subscription. Deleting the account will stop the subscription and no renewal payment will be charged.</p>
                                        <p className="text-danger">Are you sure you want to delete your account?</p>
                                        <button className="btn btn-danger mr-3" disabled={inSubmit?true:false} onClick={e => {
                                            setInSubmit(true);
                                            const cancelSubscription = CloudFunctions.httpsCallable('cancelSubscription');
                                            cancelSubscription({
                                                accountId: userData.currentAccount.id
                                            }).then(res => {
                                                setInSubmit(false);
                                                setSuccess(true);
                                            }).catch(err => {
                                                setInSubmit(false);
                                                setError(err.message);
                                            })
                                        }}>
                                            {inSubmit && 
                                                <Loader />
                                            }
                                            Yes, I want to delete the account</button>
                                        <Link className="btn btn-secondary" to={"/account/"+userData.currentAccount.id+"/billing"}>No</Link>
                                    </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            
        </>
    )
}

export default DeleteAccount;