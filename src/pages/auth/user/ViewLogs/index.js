import React, { useState, useEffect, useContext, useRef } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { FirebaseAuth } from "../../../../components/FirebaseAuth/firebase";
import Loader from '../../../../components/Loader';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import DataTable from "../../../../components/DataTable";
import { Alert } from "@mui/material";

const ViewLogs = () => {
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qs, setQs] = useState(null);
    const mountedRef = useRef(true);
    const [error, setError] = useState(null);

    const getLogs = (pz, direction, doc) => {
        const getTotal = () => {
            const userDocRef = FirebaseAuth.firestore().collection('users').doc(FirebaseAuth.auth().currentUser.uid);
            return userDocRef.get().then(function(userDoc){
                if (!mountedRef.current) return null
                if(userDoc.exists){
                    return userDoc.data().activityCount;
                }else{
                    return 0;
                }
            }).catch(() => {
                return 0;
            });
        }
    

        setLoading(true);
        let records = [];
        const collectionRef = FirebaseAuth.firestore().collection('users').doc(FirebaseAuth.auth().currentUser.uid).collection('activities');
        let query = collectionRef.orderBy('time', 'desc');
        if(direction && direction === 'next'){
            query = query.startAfter(doc);
        }
        if(direction && direction === 'previous'){
            query = query.endBefore(doc);
        }
        query = query.limit(pz);
        Promise.all([getTotal(), query.get()]).then(([activityCount, documentSnapshots]) => {
            if (!mountedRef.current) return null
            setTotal(activityCount);
            documentSnapshots.forEach(doc => {
                records.push({
                    'timestamp': doc.id,
                    'time': doc.data().time.toDate().toLocaleString(),
                    'action': doc.data().action
                });
            });
            if(records.length > 0){
                setRows(records);
                setQs(documentSnapshots);
            }
            setLoading(false);
        }).catch(e => {
            setError(e.message);
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
    },[setBreadcrumb]);

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    useEffect(() => {
        getLogs(pageSize);
    },[pageSize]);

    return (
        <UserPageLayout>
            {loading?(
                <Loader text="Loading logs..."></Loader>
            ):(
                <>
                {error?(
                    <Alert severity="error">{error}</Alert>
                ):(
                    <>
                        {total > 0 ? (
                            <DataTable columns={[
                                {name: "Activity", field: "action", style: {width: '50%'}},
                                {name: "Time", field: "time", style: {width: '50%'}}
                            ]}
                            rows={rows}
                            totalRows={total}
                            pageSize={pageSize}
                            page={page}
                            handlePageChane={(e, p) => {
                                if(p>page){
                                    getLogs(pageSize, 'next', qs.docs[qs.docs.length-1]);
                                }
                                if(p<page){
                                    getLogs(pageSize, 'previous', qs.docs[0]);
                                }
                                setPage(p);
                            }}
                            handlePageSizeChange={(e) => {
                                setPageSize(e.target.value);
                                setPage(0);
                            }}
                            ></DataTable>
                        ):(
                            <div>No activity is found</div>
                        )}
                    </>
                )}
                </>
            )}
        </UserPageLayout>
        
    )
}

export default ViewLogs;