import React, {useEffect, useState, useContext} from "react";
import { Redirect, useParams } from "react-router-dom";
import { FirebaseAuth } from "../../FirebaseAuth/firebase";
import UserMenu from '../../menus/UserMenu';
import PublicTemplate from "../../templates/PublicTemplate";
import Loader from "../../Loader";
import { AuthContext } from "../../FirebaseAuth";
import AccountMenu from "../../menus/AccountMenu";
import Logo from '../../Logo';
import {BreadcrumbContext, Breadcrumb} from '../../Breadcrumb';

const ActiveAccountTemplate = ({ role, children }) => {

    const { accountId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setUserData, authUser } = useContext(AuthContext);
    const [isActive, setIsActive] = useState(false);
    const [breadcrumb, setBreadcrumb] = useState([]);
    useEffect(() => {
        let account = {}
        setLoading(true);
        const accountRef = FirebaseAuth.firestore().doc('accounts/'+accountId);
        accountRef.get().then(doc => {
            if(doc.exists){
                if(doc.data().subscriptionStatus && doc.data().subscriptionStatus === 'active'){
                    setIsActive(true);
                }
                account.id = doc.id;
                account.name = doc.data().name;
                account.planId = doc.data().plan.id;
                account.price = doc.data().price;
                account.currency = doc.data().currency;
                account.paymentCycle = doc.data().paymentCycle;
                account.subscriptionStatus = doc.data().subscriptionStatus;
                account.subscriptionCurrentPeriodEnd = doc.data().subscriptionCurrentPeriodEnd;
                account.role = (doc.data().admins.indexOf(authUser.user.uid) === -1?('user'):('admin'));
                setUserData(userData => ({
                    ...userData,
                    currentAccount: account
                }));
                if(account.role !== role && role !== '*'){
                    setError('Permission deined.');
                }
                setLoading(false);
            }else{
                setError('Invalid account.');
                setLoading(false);
            }
        }).catch(err => {
            setError(err.message);
            setLoading(false);
        })
    },[accountId, setUserData, role, authUser]);

    return (
        <>
            {loading ? (
                <PublicTemplate>
                    <Loader size="5x" text="Loading..."/>
                </PublicTemplate>
            ):(
                <>
                {error === null ? (
                    <>
                    {isActive ? (
                        <div className="c-app">
                            <div className="c-sidebar c-sidebar-dark c-sidebar-fixed c-sidebar-lg-show" id="sidebar">
                                <div className="c-sidebar-brand d-md-down-none">
                                    <Logo />
                                </div>
                                <AccountMenu />
                                <button className="c-sidebar-minimizer c-class-toggler" data-target="_parent" data-class="c-sidebar-minimized" type="button" />
                            </div>
                            <div className="c-wrapper">
                                <header className="c-header c-header-light c-header-fixed">
                                    <button className="c-header-toggler c-class-toggler d-lg-none mfe-auto" type="button" data-target="#sidebar" data-class="c-sidebar-show">
                                        <i className="mt-3 fa fa-bars" />
                                    </button>
                                    <div className="mfe-auto">
                                        <button className="c-header-toggler c-class-toggler mfs-3 d-md-down-none" data-target="#sidebar" data-class="c-sidebar-lg-show">
                                            <i className="mt-3 fa fa-bars" />
                                        </button>
                                    </div>
                                    <ul className="c-header-nav">
                                        <UserMenu />
                                    </ul>
                                    <Breadcrumb links={breadcrumb} />
                                </header>
                                <div className="c-body">
                                    <main className="c-main">
                                    <BreadcrumbContext.Provider value={{setBreadcrumb}}>
                                    {children}
                                    </BreadcrumbContext.Provider>
                                    </main>
                                </div>
                            </div>
                        </div>
                    ):(
                        <Redirect to={'/account/'+accountId+'/plan'}></Redirect>
                    )}
                    </>
                ):(
                    <PublicTemplate>
                        {error}
                    </PublicTemplate>
                )}
                </>
            )}
        </>
		
    )
}

export default ActiveAccountTemplate;