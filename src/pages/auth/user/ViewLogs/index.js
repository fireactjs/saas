import React, { useState, useEffect, useContext, useRef } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { FirebaseAuth } from "../../../../components/FirebaseAuth/firebase";
import Loader from '../../../../components/Loader';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import DataTable from "../../../../components/DataTable";

const ViewLogs = () => {
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qs, setQs] = useState(null);
    const mountedRef = useRef(true);

    const getTotal = () => {
        setLoading(true);
        const userDocRef = FirebaseAuth.firestore().collection('users').doc(FirebaseAuth.auth().currentUser.uid);
        userDocRef.get().then(function(userDoc){
            if (!mountedRef.current) return null
            if(userDoc.exists){
                setTotal(userDoc.data().activityCount);
                setLoading(false);
            }
        })
    }

    const getLogs = (pz, direction, doc) => {
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
                setRows(records);
                setQs(documentSnapshots);
            }
            setLoading(false);
        }).catch(e => {
            console.log(e);
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
        return () => { 
            mountedRef.current = false
        }
    },[setBreadcrumb]);

    useEffect(() => {
        getLogs(pageSize);
    },[pageSize]);

    return (
        <UserPageLayout>
            {loading?(
                <Loader text="Loading logs..."></Loader>
            ):(
                <>
                {total > 0 ? (
                    <DataTable columns={[
                        {name: "Activity", field: "action"},
                        {name: "Time", field: "time"}
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
            
        </UserPageLayout>
        
    )
}

export default ViewLogs;