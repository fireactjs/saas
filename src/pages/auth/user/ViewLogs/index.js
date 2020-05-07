import React, { useState, useEffect } from "react";
import Breadcrumb from '../../../../components/Breadcrumb';
import { FirebaseAuth } from "../../../../components/FirebaseAuth/firebase";
import Loader from '../../../../components/Loader';

const ViewLogs = () => {
    const Firestore = FirebaseAuth.firestore();
    const currentUser = FirebaseAuth.auth().currentUser;
    const pageSize = 10;

    const [total, setTotal] = useState(0);
    const getTotal = () => {
        const userDocRef = Firestore.collection('users').doc(currentUser.uid);
        userDocRef.get().then(function(userDoc){
            if(userDoc.exists){
                setTotal(userDoc.data().activityCount);
            }
        })
    }

    // document snapshots
    const [qs, setQs] = useState(null);

    const [rows, setRows] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const getLogs = (pageSize, lastDoc) => {
        setLoading(true);
        let records = [];
        const collectionRef = Firestore.collection('users').doc(currentUser.uid).collection('activities');
        let query = collectionRef.orderBy('time', 'desc');
        if(lastDoc){
            query = query.startAfter(lastDoc);
        }
        query = query.limit(pageSize);
        query.get().then(documentSnapshots => {
            documentSnapshots.forEach(doc => {
                records.push({
                    'timestamp': doc.id,
                    'time': doc.data().time.toDate().toString(),
                    'action': doc.data().action
                });
            });
            let existingRows = rows;
            existingRows.push.apply(existingRows, records);
            setRows(existingRows);
            setQs(documentSnapshots);
            setCount(documentSnapshots.size+count);
            setLoading(false);
        });
    }

    const title = 'View Activity Logs'
    const breadcrumbLinks = [
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
    ];

    useEffect(() => {
        getTotal();
        getLogs(pageSize);
    },[]);

    return (
        <>
            <Breadcrumb links={breadcrumbLinks} />
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
                                        <table className="table table-bordered">
                                            <thead className="thead-light">
                                                <tr role="row">
                                                    <th>Activity</th>
                                                    <th>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.map(r => 
                                                    <tr key={r.timestamp} row="row">
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