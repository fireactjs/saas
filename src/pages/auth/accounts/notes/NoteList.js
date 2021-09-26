import React, {useContext, useCallback, useRef } from 'react';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { FirebaseAuth } from '../../../../components/FirebaseAuth/firebase';
import DataList from '../../../../components/DataList';

const NoteList = () => {
    const { userData } = useContext(AuthContext);
    const currentPage = useRef(0);
    const records = useRef(null);

    const ListApi = useCallback((page, pageSize) => {
        const fields = [
            "subject"
        ];
        let direction = null;
        let doc = null;
        if(page > currentPage.current){
            direction = "next";
            doc = records.current[records.current.length-1]["_doc"];
        }
        if(page < currentPage.current){
            direction = "previous";
            doc = records.current[0]["_doc"];
        }
        currentPage.current = page;
        return FireStoreListDoc('/accounts/'+userData.currentAccount.id+'/notes', fields, 'createAt', 'desc', pageSize, direction, doc).then(res => {
            records.current = res;
            return {total: -1, data: res};
        }).catch(err => {
            throw(err);
        });
    },[userData]);

    return (
        <DataList
            title="Note List"
            api={ListApi}
            schema={[
                {
                    name: "ID",
                    field: "id"
                },
                {
                    name: "Subject",
                    field: "subject"
                }
            ]}
        />
    )
}

const FireStoreListDoc = (path, fields, orderBy, order, pageSize, direction, doc) => {
    const Firestore = FirebaseAuth.firestore();
    const colRef = Firestore.collection(path);
    let query = colRef.orderBy(orderBy, order);
    if(direction && direction === 'next'){
        query = query.startAfter(doc);
    }
    if(direction && direction === 'previous'){
        query = query.endBefore(doc);
    }
    query = query.limit(pageSize);
    return query.get().then(documentSnapshots => {
        let records = [];
        documentSnapshots.forEach(documentSnapshot => {
            records.push({
                id: documentSnapshot.id,
                _doc: documentSnapshot
            });
            fields.forEach(field => {
                records[records.length-1][field] = documentSnapshot.data()[field];
            })
        });
        return records;
    }).catch(err => {
        throw(err);
    })
}

export default NoteList;