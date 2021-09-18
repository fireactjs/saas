import React, {useState, useContext, useEffect, useRef} from "react";
import { BreadcrumbContext } from '../../../components/Breadcrumb';
import { FirebaseAuth } from "../../../components/FirebaseAuth/firebase";
import { useHistory, Redirect } from 'react-router-dom';
import Loader from '../../../components/Loader';
import { Card, Button, CardActions, Grid, CardHeader } from "@mui/material";

const Home = () => {
    const title = 'My Accounts';
    const history = useHistory();   

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
    },[setBreadcrumb]);

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    return (
        <>
            {accounts.length > 0 ? (
                <>
                    <div style={{marginTop: '20px', marginBottom: '20px'}}>
                        <Button onClick={() => history.push('/new-account')} color="primary" variant="contained"><i className="fa fa-plus"></i> Add Account</Button>
                    </div>
                    <Grid container spacing={3}>
                    {accounts.map((account, i) => 
                        <Grid container item xs={12} md={3} key={i}>
                            <Card key={account.id} style={{width: '100%'}}>
                                <CardHeader title={account.name}/>
                                <CardActions>
                                    {account.subscriptionStatus?(
                                        <Button size="small" color="primary" onClick={() => history.push('/account/'+account.id+'/')}>Account Overview</Button>
                                    ):(
                                        <Button size="small" color="warning" onClick={() => history.push('/account/'+account.id+'/billing/plan')}>Activate the account</Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    )}
                    </Grid>
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
        </>

    )
}

export default Home;