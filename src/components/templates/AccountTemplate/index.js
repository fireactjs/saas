import React, {useEffect, useState, useContext} from "react";
import { Redirect, useParams } from "react-router-dom";
import { FirebaseAuth } from "../../FirebaseAuth/firebase";
import UserMenu from '../../menus/UserMenu';
import AppMenu from '../../menus/AppMenu';
import PublicTemplate from "../../templates/PublicTemplate";
import Loader from "../../Loader";
import { AuthContext } from "../../FirebaseAuth";
import AccountMenu from "../../menus/AccountMenu";
import Layout from '../../Layout';

const AccountTemplate = ({ role, allowInactive, children }) => {

    const { accountId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setUserData, authUser } = useContext(AuthContext);
    const [isActive, setIsActive] = useState(false);

    allowInactive = allowInactive || false;

    useEffect(() => {
        let account = {}
        setLoading(true);
        const accountRef = FirebaseAuth.firestore().doc('accounts/'+accountId);
        accountRef.get().then(doc => {
            if(doc.exists){
                if(doc.data().subscriptionStatus && doc.data().subscriptionStatus==='active'){
                    setIsActive(true);
                }
                account.id = doc.id;
                account.owner = doc.data().owner;
                account.name = doc.data().name;
                account.planId = null;
                if(doc.data().plan){
                    account.planId = doc.data().plan.id;
                }
                account.price = doc.data().price;
                account.subscriptionStatus = doc.data().subscriptionStatus;
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
                    <Loader text="Loading..."/>
                </PublicTemplate>
            ):(
                <>
                {error === null ? (
                    (isActive || (!isActive && allowInactive)) ? (
                        <Layout drawerMenu={isActive?(
                            <AccountMenu />
                        ):(
                            <AppMenu />
                        )} toolBarMenu={<UserMenu />} >
                            {children}
                        </Layout>
                    ):(
                        <Redirect to={'/account/'+accountId+'/billing/plan'}></Redirect>
                    ) 
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

export default AccountTemplate;