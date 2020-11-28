import React, { useState, useEffect, useContext, useRef } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { FirebaseAuth } from "../../../../components/FirebaseAuth/firebase";
import Loader from '../../../../components/Loader';

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
        <>
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="card">
                        <div className="card-header">
                            {title}
                        </div>
                        <div className="card-body">
                            {total > 0 ? (
                                <>
                                    <div className="col-sm-12 table-responsive">
                                        <table className="table table-responsive-sm table-hover table-outline">
                                            <thead className="thead-light">
                                                <tr role="row">
                                                    <th>Activity</th>
                                                    <th>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.map((r,i) => 
                                                    <tr key={r.timestamp+i} row="row">
                                                        <td>{r.action}</td>
                                                        <td>{r.time}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row">
                                        <div className="col-5">
                                            {count} of {total}
                                        </div>
                                        <div className="col-7 text-right">
                                            <button className="btn btn-primary" disabled={(total===count || loading)?'disabled':''} onClick={e => {
                                                e.preventDefault();
                                                getLogs(pageSize, qs.docs[qs.docs.length-1]);
                                            }} >{loading && <Loader />} More activities...</button>
                                        </div>
                                    </div>
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
                        </div>
                    </div>
                </div>
            </div>
            
        </>
        
    )
}

export default ViewLogs;