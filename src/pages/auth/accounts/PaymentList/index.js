import React, { useContext, useState, useEffect, useRef } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { FirebaseAuth } from "../../../../components/FirebaseAuth/firebase";
import { Link } from "react-router-dom";
import Loader from "../../../../components/Loader";
import { currency } from "../../../../inc/currency.json";

const PaymentList = () => {
    const title = 'Payment History';

    const { userData, authUser } = useContext(AuthContext);
    const { setBreadcrumb } = useContext(BreadcrumbContext);

    // document snapshots
    const pageSize = 10;
    const [qs, setQs] = useState(null);
    const mountedRef = useRef(true);

    const [rows, setRows] = useState([]);
    const [toEnd, setToEnd] = useState(false);
    const [loading, setLoading] = useState(false);

    const getInvoices = (accountId, pageSize, lastDoc) => {
        setLoading(true);
        let records = [];
        const collectionRef = FirebaseAuth.firestore().collection('accounts').doc(accountId).collection('invoices');
        let query = collectionRef.orderBy('created', 'desc');
        if(lastDoc){
            query = query.startAfter(lastDoc);
        }
        query = query.limit(pageSize);
        query.get().then(documentSnapshots => {
            if (!mountedRef.current) return null
            if(documentSnapshots.empty){
                setToEnd(true);
            }else{
                documentSnapshots.forEach(doc => {
                    records.push({
                        'id': doc.id,
                        'total': (Math.round(doc.data().total / 100)).toFixed(2),
                        'subTotal': (Math.round(doc.data().subTotal / 100)).toFixed(2),
                        'tax': (Math.round((doc.data().tax || 0) / 100)).toFixed(2),
                        'amountPaid': (Math.round(doc.data().amountPaid / 100)).toFixed(2),
                        'created': (new Date(doc.data().created * 1000)).toLocaleString(),
                        'hostedInvoiceUrl': doc.data().hostedInvoiceUrl,
                        'currency': doc.data().currency,
                        'status': doc.data().status
                    });
                });
                if(records.length > 0){
                    setRows(rows => rows.concat(records));
                    setQs(documentSnapshots);
                }
            }
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
                to: "/account/"+userData.currentAccount.id+"/",
                text: userData.currentAccount.name,
                active: false
            },
            {
                to: null,
                text: "Billing",
                active: true
            }
        ]);
        getInvoices(userData.currentAccount.id, pageSize);
        return () => { 
            mountedRef.current = false
        }
    },[userData, setBreadcrumb]);


    return (
        <>
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="text-right mb-3">
                        {userData.currentAccount.owner === authUser.user.uid &&
                            <>
                                {userData.currentAccount.price > 0 && 
                                    <Link to={"/account/"+userData.currentAccount.id+"/billing/payment-method"} className="btn btn-primary mr-2">Update Payment Method</Link>
                                }
                                <Link to={"/account/"+userData.currentAccount.id+"/billing/plan"} className="btn btn-primary mr-2">Change Subscription Plan</Link>
                                <Link to={"/account/"+userData.currentAccount.id+"/billing/delete"} className="btn btn-danger">Delete Account</Link>
                            </>
                        }
                    </div>
                    <div className="card">
                        <div className="card-header">
                            {title}
                        </div>
                        <div className="card-body">
                            {rows.length > 0 &&
                                <>
                                    <table className="table table-responsive-sm table-hover table-outline">
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Invoice ID</th>
                                                <th scope="col">Amount</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Invoice Date</th>
                                                <th scope="col">Invoice URL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {rows.map((r,i) => 
                                            <tr key={r.id}>
                                                <td><a className="btn btn-link" rel="noreferrer" href={r.hostedInvoiceUrl} target="_blank">{r.id}</a></td>
                                                <td>{currency[r.currency].sign}{r.total}</td>
                                                <td>{r.status.toUpperCase()}</td>
                                                <td>{r.created}</td>
                                                <td><a href={r.hostedInvoiceUrl} rel="noreferrer" target="_blank" className="btn btn-info">View Invoice</a></td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </>
                            }
                            {loading?(
                                <Loader text="Loading data..."></Loader>
                            ):(
                                <>
                                {toEnd?(
                                    <span>End of all invoices</span>
                                ):(
                                    <button className="btn btn-primary" onClick={e => {
                                        getInvoices(userData.currentAccount.id, pageSize, qs.docs[qs.docs.length-1]);
                                    }}>View More</button>
                                )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentList;