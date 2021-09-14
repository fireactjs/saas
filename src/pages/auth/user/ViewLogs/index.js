import { Button } from "@material-ui/core";
import React, { useState, useEffect, useContext, useRef } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { FirebaseAuth } from "../../../../components/FirebaseAuth/firebase";
import Loader from '../../../../components/Loader';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, } from '@material-ui/core';
const ViewLogs = () => {
    const pageSize = 10;

    const [total, setTotal] = useState(0);
    const getTotal = () => {
        const userDocRef = FirebaseAuth.firestore().collection('users').doc(FirebaseAuth.auth().currentUser.uid);
        userDocRef.get().then(function(userDoc){
            if (!mountedRef.current) return null
            if(userDoc.exists){
                setTotal(userDoc.data().activityCount);
            }
        })
    }

    // document snapshots
    const [qs, setQs] = useState(null);
    const mountedRef = useRef(true);

    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const getLogs = (pageSize, lastDoc) => {
        setLoading(true);
        let records = [];
        const collectionRef = FirebaseAuth.firestore().collection('users').doc(FirebaseAuth.auth().currentUser.uid).collection('activities');
        let query = collectionRef.orderBy('time', 'desc');
        if(lastDoc){
            query = query.startAfter(lastDoc);
        }
        query = query.limit(pageSize);
        query.get().then(documentSnapshots => {
            if (!mountedRef.current) return null
            documentSnapshots.forEach(doc => {
                records.push({
                    'timestamp': doc.id,
                    'time': doc.data().time.toDate().toLocaleString(),
                    'action': doc.data().action
                });
            });
            if(records.length > 0){
                setRows(rows => rows.concat(records));
                setQs(documentSnapshots);
                setCount(count => documentSnapshots.size+count);
            }
            setLoading(false);
        });
    }

    const title = 'View Activity Logs'
    const { setBreadcrumb } = useContext(BreadcrumbContext);

    useEffect(() => {
        setBreadcrumb([
            {
                to: "/",
                text: "Home",
                active: false
            },
            {
                to: "/user/profile",
                text: "User",
                active: false
            },
            {
                to: null,
                text: title,
                active: true
            }
        ]);
        getTotal();
        getLogs(pageSize);
        return () => { 
            mountedRef.current = false
        }
    },[setBreadcrumb]);

    return (
        <UserPageLayout>
            {total > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Activity</TableCell>
                                    <TableCell>Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {rows.map((r,i) => 
                                <TableRow key={i}>
                                    <TableCell component="th" scope="row">
                                        {r.action}
                                    </TableCell>
                                    <TableCell>
                                        {r.time}
                                    </TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <p></p>
                    <Button variant="contained" color="primary" disabled={(total===count || loading)} onClick={(e) => {
                        e.preventDefault();
                        getLogs(pageSize, qs.docs[qs.docs.length-1]);
                    }} >
                        {loading && <Loader />} More activities...
                    </Button>
                </>
            ):(
                <>
                {(qs === null) ? (
                    <Loader text="loading logs..."></Loader>
                ):(
                    <div>No activity is found</div>
                )}
                </>
            )}
        </UserPageLayout>
        
    )
}

export default ViewLogs;