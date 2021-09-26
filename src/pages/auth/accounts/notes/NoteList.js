import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { FirebaseAuth } from '../../../../components/FirebaseAuth/firebase';
import { useHistory } from "react-router-dom";
import { Paper, Box, Stack, Button } from '@mui/material';
import DataTable from '../../../../components/DataTable';


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
            return res;
        }).catch(err => {
            throw(err);
        });
    },[userData]);

    return (
        <List
            title="Note List"
            api={ListApi}
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


const List = ({title, api}) => {
    const { userData } = useContext(AuthContext);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    const [rows, setRows] = useState([]);
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

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
                text: "Notes",
                active: false
            }
        ]);
    },[setBreadcrumb, title, userData]);
    
    useEffect(() => {
        api(page, pageSize).then(
            res => {
                setRows(res);
            }
        )
    },[api, page, pageSize]);

    return (
        <>
            <Stack spacing={3}>
                <div style={{marginLeft: "auto"}}>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" onClick={() => history.push("/account/"+userData.currentAccount.id+"/notes/create")} >Create Note</Button>
                    </Stack>
                </div>
                <Paper>
                    <Box>

                            <DataTable
                                columns={[
                                    {name: "ID", field: "id"},
                                    {name: "Subject", field: "subject"}
                                ]}
                                rows = {rows}
                                totalRows = {-1}
                                pageSize = {pageSize}
                                page={page}
                                handlePageChane = {(e, p) => {
                                    //api(p, pageSize);
                                    setPage(p);
                                }}
                                handlePageSizeChange = {(e) => {
                                    //api(0, e.target.value);
                                    setPage(0);
                                    setPageSize(e.target.value);
                                }}
                            />
                        
                    </Box>
                </Paper>
            </Stack>
        </>
    )
}

export default NoteList;