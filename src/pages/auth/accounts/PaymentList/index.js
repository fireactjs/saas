import React, { useContext, useState, useEffect, useRef } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { FirebaseAuth } from "../../../../components/FirebaseAuth/firebase";
import { useHistory } from "react-router-dom";
import Loader from "../../../../components/Loader";
import DataTable from "../../../../components/DataTable";
import { currency } from "../../../../inc/currency.json";
import { Paper, Box, Stack, Button, Alert } from "@mui/material";

const PaymentList = () => {
    const title = 'Billing History';
    const history = useHistory();

    const { userData, authUser } = useContext(AuthContext);
    const { setBreadcrumb } = useContext(BreadcrumbContext);

    // document snapshots
    const [qs, setQs] = useState(null);
    const mountedRef = useRef(true);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getInvoices = (accountId, pageSize, direction, doc) => {
        const getInvoiceCollectionCount = (accountId) => {
            const accountDocRef = FirebaseAuth.firestore().collection('accounts').doc(accountId);
            return accountDocRef.get().then(accountDoc => {
                if(accountDoc.exists){
                    return accountDoc.data().invoicesColCount;
                }else{
                    return 0;
                }
            }).catch(() => {
                return 0;
            })
        }
    
        setLoading(true);
        let records = [];
        const collectionRef = FirebaseAuth.firestore().collection('accounts').doc(accountId).collection('invoices');
        let query = collectionRef.orderBy('created', 'desc');
        if(direction && direction === 'next'){
            query = query.startAfter(doc);
        }
        if(direction && direction === 'previous'){
            query = query.endBefore(doc);
        }
        query = query.limit(pageSize);
        Promise.all([getInvoiceCollectionCount(accountId), query.get()]).then(([invoiceCount, documentSnapshots]) => {
            if (!mountedRef.current) return null
            setTotal(invoiceCount);
            documentSnapshots.forEach(doc => {
                records.push({
                    'id': doc.id,
                    'total': (doc.data().total / 100).toFixed(2),
                    'subTotal': (doc.data().subTotal / 100).toFixed(2),
                    'tax': ((doc.data().tax || 0) / 100).toFixed(2),
                    'amountPaid': (Math.round(doc.data().amountPaid / 100)).toFixed(2),
                    'created': (new Date(doc.data().created * 1000)).toLocaleString(),
                    'hostedInvoiceUrl': doc.data().hostedInvoiceUrl,
                    'currency': doc.data().currency,
                    'status': doc.data().status,
                    'amountCol': <>{currency[doc.data().currency].sign}{(doc.data().total / 100).toFixed(2)}</>,
                    'statusCol': <>{doc.data().status.toUpperCase()}</>,
                    'urlCol': doc.data().hostedInvoiceUrl?(
                        <Button href={doc.data().hostedInvoiceUrl} rel="noreferrer" target="_blank" variant="contained" size="small">View Invoice</Button>
                    ):(<></>)
                });
            });
            
            if(records.length > 0){
                setRows(records);
                setQs(documentSnapshots);
            }
            setLoading(false);
        }).catch(e => {
            if (!mountedRef.current) return null
            setError(e);
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
                text: title,
                active: true
            }
        ]);
    },[userData, setBreadcrumb]);

    useEffect(() => {
        getInvoices(userData.currentAccount.id, pageSize);
    },[pageSize, userData]);

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);


    return (
        <Stack spacing={3}>
            {userData.currentAccount.owner === authUser.user.uid &&
                <Stack direction="row-reverse" spacing={1} mt={2}>
                    <Button color="error" variant="contained" onClick={() => history.push("/account/"+userData.currentAccount.id+"/billing/delete")}>Delete Account</Button>
                    <Button color="info" variant="contained" onClick={() => history.push("/account/"+userData.currentAccount.id+"/billing/plan")}>Change Subscription Plan</Button>
                    {userData.currentAccount.price > 0 && 
                    <Button color="info" variant="contained" onClick={() => history.push("/account/"+userData.currentAccount.id+"/billing/payment-method")}>Update Payment Method</Button>
                    }
                </Stack>
            }
            <Paper>
                    {loading?(
                        <Box p={3}>
                            <Loader text="Loading billing history..."></Loader>
                        </Box>
                    ):(
                        <>
                        {error?(
                            <Box p={3}>
                                <Alert severity="error">{error}</Alert>
                            </Box>
                        ):(
                            <>
                                {total > 0 ? (
                                    <DataTable columns={[
                                        {name: "Invoice ID", field: "id", style: {width: '30%'}},
                                        {name: "Amount", field: "amountCol", style: {width: '15%'}},
                                        {name: "Status", field: "statusCol", style: {width: '15%'}},
                                        {name: "Invoice Date", field: "created", style: {width: '30%'}},
                                        {name: "Invoice URL", field: "urlCol", style: {width: '10%'}}
                                    ]}
                                    rows={rows}
                                    totalRows={total}
                                    pageSize={pageSize}
                                    page={page}
                                    handlePageChane={(e, p) => {
                                        if(p>page){
                                            getInvoices(userData.currentAccount.id, pageSize, 'next', qs.docs[qs.docs.length-1]);
                                        }
                                        if(p<page){
                                            getInvoices(userData.currentAccount.id, pageSize, 'previous', qs.docs[0]);
                                        }
                                        setPage(p);
                                    }}
                                    handlePageSizeChange={(e) => {
                                        setPageSize(e.target.value);
                                        setPage(0);
                                    }}
                                    ></DataTable>
                                ):(
                                    <Box p={3}>No invoice is found</Box>
                                )}
                            </>
                        )}
                        </>
                    )}
            </Paper>
        </Stack>
    )
}

export default PaymentList;