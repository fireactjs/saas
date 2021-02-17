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
    const [selectedInvoice, setSelectedInvoice] = useState(null);

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
                        'periodStart': (new Date(doc.data().periodStart * 1000)).toLocaleString(),
                        'preiodEnd': (new Date(doc.data().preiodEnd * 1000)).toLocaleString(),
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {rows.map((r,i) => 
                                            <tr key={r.id}>
                                                <td><button className="btn btn-link" onClick={e => {
                                                    setSelectedInvoice(r);
                                                }}>{r.id}</button></td>
                                                <td>{currency[r.currency].sign}{r.total}</td>
                                                <td>{r.status.toUpperCase()}</td>
                                                <td>{r.created}</td>
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
            {selectedInvoice !== null && 
            <>
            <div className="modal fade show" tabIndex="-1" role="dialog" style={{display: "block"}}>
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Invoice: {selectedInvoice.id}</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={e => {
                                setSelectedInvoice(null);
                            }}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row mb-3 mt-3">
                                <div className="col-4 text-right">
                                    <strong>Created Time:</strong>
                                </div>
                                <div className="col-8">
                                    {selectedInvoice.created}
                                </div>
                            </div>
                            <div className="row mb-3">    
                                <div className="col-4 text-right">
                                    <strong>Billing Period:</strong>
                                </div>
                                <div className="col-8">
                                    {selectedInvoice.periodStart} ~ {selectedInvoice.preiodEnd}
                                </div>
                            </div>
                            <div className="row mb-3">    
                                <div className="col-4 text-right">
                                    <strong>Subtotal:</strong>
                                </div>
                                <div className="col-8">
                                    {currency[selectedInvoice.currency].sign}{selectedInvoice.subTotal}
                                </div>
                            </div>
                            <div className="row mb-3">    
                                <div className="col-4 text-right">
                                    <strong>Tax:</strong>
                                </div>
                                <div className="col-8">
                                    {currency[selectedInvoice.currency].sign}{selectedInvoice.tax}
                                </div>
                            </div>
                            <div className="row mb-3">    
                                <div className="col-4 text-right">
                                    <strong>Total:</strong>
                                </div>
                                <div className="col-8">
                                    {currency[selectedInvoice.currency].sign}{selectedInvoice.total}
                                </div>
                            </div>
                            <div className="row mb-3">    
                                <div className="col-4 text-right">
                                    <strong>Paid Amount:</strong>
                                </div>
                                <div className="col-8">
                                    {currency[selectedInvoice.currency].sign}{selectedInvoice.amountPaid}
                                </div>
                            </div>
                            <div className="row mb-3">    
                                <div className="col-4 text-right">
                                    <strong>Status:</strong>
                                </div>
                                <div className="col-8">
                                    {selectedInvoice.status.toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
            </>
            }
        </>
    )
}

export default PaymentList;