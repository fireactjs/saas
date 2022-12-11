import React, {useContext, useEffect, useState} from "react";
import "firebase/compat/firestore";
import { AuthContext } from "@fireactjs/core";
import { SubscriptionContext } from "./SubscriptionContext";
import { Button } from "@mui/material";
import currencies from "./currencies.json";

export const ListInvoices = ({loader}) => {

    const [loaded, setLoaded] = useState(false);
    const { subscription } = useContext(SubscriptionContext)
    const { firebaseApp } = useContext(AuthContext);
    const [ invoices, setInvoices ] = useState([]);

    useEffect(() => {
        setLoaded(false);
        const invoicesRef = firebaseApp.firestore().collection('subscriptions/'+subscription.id+"/invoices");
        invoicesRef.orderBy('created', 'desc').get().then(invoicesSnapshot => {
            const records = [];
            invoicesSnapshot.forEach(invoice => {
                records.push({
                    'id': invoice.id,
                    'total': (invoice.data().total / 100).toFixed(2),
                    'subTotal': (invoice.data().subTotal / 100).toFixed(2),
                    'tax': ((invoice.data().tax || 0) / 100).toFixed(2),
                    'amountPaid': (Math.round(invoice.data().amountPaid / 100)).toFixed(2),
                    'created': (new Date(invoice.data().created * 1000)).toLocaleString(),
                    'hostedInvoiceUrl': invoice.data().hostedInvoiceUrl,
                    'currency': invoice.data().currency,
                    'status': invoice.data().status,
                    'amountCol': <>{currencies[invoice.data().currency].sign}{(invoice.data().total / 100).toFixed(2)}</>,
                    'statusCol': <>{invoice.data().status.toUpperCase()}</>,
                    'urlCol': invoice.data().hostedInvoiceUrl?(
                        <Button href={invoice.data().hostedInvoiceUrl} rel="noreferrer" target="_blank" variant="contained" size="small">View Invoice</Button>
                    ):(<></>)
                })
            })
            setInvoices(records);
            setLoaded(true);
        }).catch(err => {
            setLoaded(true);
        });
    }, [firebaseApp, subscription.id]);

    return (
        <>
            {loaded?(
                <>
                </>
            ):(
                <>{loader}</>
            )}
        </>
    )
}