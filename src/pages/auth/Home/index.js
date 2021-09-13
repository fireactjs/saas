import React, {useState, useContext, useEffect, useRef} from "react";
import { BreadcrumbContext } from '../../../components/Breadcrumb';
import { FirebaseAuth } from "../../../components/FirebaseAuth/firebase";
import { Link, Redirect } from 'react-router-dom';
import Loader from '../../../components/Loader';

const Home = () => {
    const title = 'My Accounts';

    const { setBreadcrumb } = useContext(BreadcrumbContext);
    

    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const mountedRef = useRef(true);

    const getAccounts = () => {
        setLoading(true);
        let records = [];
        const accountsRef = FirebaseAuth.firestore().collection('accounts');
        let query = accountsRef.where('access', 'array-contains', FirebaseAuth.auth().currentUser.uid);
        query.get().then(accountSnapshots => {
            console.log(accountSnapshots);
            if (!mountedRef.current) return null
            accountSnapshots.forEach(account => {
                records.push({
                    'id': account.id,
                    'name': account.data().name,
                    'subscriptionStatus': account.data().subscriptionStatus
                });
            });
            setAccounts(records);
            setLoading(false);
        });
    }

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
        getAccounts();
        return () => { 
            mountedRef.current = false
        }
    },[setBreadcrumb]);

    return (
        <>
            <div className="container-fluid">
                <div className="animated fadeIn">
                    
                    {accounts.length > 0 ? (
                        <>
                            <div className="text-right mb-3">
                                <Link to="/new-account" className="btn btn-primary"><i className="fa fa-plus"></i> Add Account</Link>
                            </div>
                            
                            {accounts.map((account, i) => 
                                
                                <div className="card" key={account.id}>
                                    <div className="card-header font-weight-bold">
                                        <h5>{account.name}</h5>
                                    </div>
                                    <div className="card-body">
                                        {account.subscriptionStatus?(
                                            <Link to={'/account/'+account.id+'/'}>Account Overview</Link>
                                        ):(
                                            <Link to={'/account/'+account.id+'/billing/plan'}>Activate the account</Link>
                                        )}
                                    </div>
                                </div>
                                
                            )}
                            
                        </>
                    ) : (
                        <>
                            {(loading) ? (
                                <Loader text="loading accounts..."></Loader>
                            ):(
                                <Redirect to="/new-account"></Redirect>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>

    )
}

export default Home;