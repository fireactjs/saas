import React, { useContext, useEffect } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { Link } from "react-router-dom";

const Overview = () => {
    const title = 'Overview';

    const { userData } = useContext(AuthContext);
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
                to: null,
                text: title,
                active: true
            }
        ]);
    }, [userData, setBreadcrumb, title]);

    return (
        <>
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="card">
                        <div className="card-header">
                            {title}
                        </div>
                        <div className="card-body">
                            <p>This is the overview of the account</p>
                            {!userData.currentAccount.subscriptionStatus && 
                            <p>Account status is not active, <Link to={"/account/"+userData.currentAccount.id+"/plan"}>activate a plan here to continue</Link>.</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Overview;