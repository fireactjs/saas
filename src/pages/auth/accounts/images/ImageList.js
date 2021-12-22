import React, { useContext, useRef, useEffect, useState, useCallback } from "react";
import DataList from '../../../../components/DataList';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { useHistory } from "react-router-dom";
import { ListImageApiStatic, DeleteImageApiStatic } from './ImagesApis';
import imagesJson from './images.json';
import { Stack, Button, Alert } from '@mui/material';
import DataDelete from "../../../../components/DataDelete";
import { FirebaseAuth } from '../../../../components/FirebaseAuth/firebase';

const ActionButtons = ({id, handleDeletion}) => {
    const history = useHistory();
    const { userData } = useContext(AuthContext);
    const url = '/account/'+userData.currentAccount.id+'/images/edit/'+id;

    return (
        <Stack direction="row" spacing={1} mt={2}>
            <Button variant="contained" onClick={() => history.push(url)}>Edit</Button>
            <DataDelete id={id} handleDeletion={handleDeletion} />
        </Stack>
    )
}

const ImageList = () => {
    const title = "Images";
    const { userData } = useContext(AuthContext);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    const history = useHistory();
    const [refreshCount, setRefreshCount] = useState(0);
    const currentPage = useRef(0);
    const records = useRef([]);
    const useStaticData = imagesJson.useStaticData;
    const listFields = imagesJson.listFields;

    const handleFetch = useCallback((page, pageSize) => {
        return new Promise((resolve, reject) => {

            const ListImageApiFirestore = (page, pageSize) => {
                const start = page * pageSize;
                if(records.current.length-1>=start){
                    // if the page has been loaded, read from records
                    return new Promise((resolve, reject) => {
                        let docs = [];
                        for(let i=start; i<records.current.length; i++){
                            if(records.current.length<=i || i>=(start+pageSize)){
                                break;
                            }
                            docs.push(records.current[i]);
                        }
                        resolve({
                            total: -1,
                            data: docs
                        })
                    });
                }else{
                    // if the page hasn't been loaded, read from Firestore
                    const fields = ["title", "url"];
                    let doc = null;
                    if(page > 0 && records.current.length > 0){
                        // find the last document if the requested page is not the first page
                        doc = records.current[records.current.length-1]["_doc"];
                    }
                    currentPage.current = page;
                    const Firestore = FirebaseAuth.firestore();
                    const colRef = Firestore.collection('/accounts/'+userData.currentAccount.id+'/images');
                    let query = colRef.orderBy('createAt', 'desc');
                    if(doc !== null){
                        query = query.startAfter(doc);
                    }
                    query = query.limit(pageSize);
                    return query.get().then(documentSnapshots => {
                        let docs = [];
                        if(!documentSnapshots.empty){
                            documentSnapshots.forEach(documentSnapshot => {
                                docs.push({
                                    id: documentSnapshot.id,
                                    _doc: documentSnapshot
                                });
                                fields.forEach(field => {
                                    docs[docs.length-1][field] = documentSnapshot.data()[field];
                                })
                            });
                            records.current = records.current.concat(docs);
                        }
                        return {total: -1, data: docs}
                    }).catch(err => {
                        throw(err);
                    })
                }
            }

            let ListImageApi = useStaticData?ListImageApiStatic:ListImageApiFirestore;

            // apply custom filter here if you wish to pass additional parameters to the api calls
            ListImageApi(page, pageSize).then(images => {
                const handleDeletion = (id) => {
                    if(useStaticData){
                        DeleteImageApiStatic(id).then(() => {
                            setRefreshCount(refreshCount+1);
                        });
                    }else{
                        const Firestore = FirebaseAuth.firestore();
                        const DocRef = Firestore.doc('/accounts/'+userData.currentAccount.id+'/images/'+id);
                        DocRef.delete().then(() => {
                            // remove the record from records then update the list in the UI
                            for(let i=0; i<records.current.length; i++){
                                if(records.current[i].id === id){
                                    records.current.splice(i, 1);
                                }
                            }
                            setRefreshCount(refreshCount+1);
                        })
                    }
                    
                }

                let rows = [];
                // loop through the data to add the visual components in to the list
                for(let i=0; i<images.data.length; i++){
                    const row = {
                        id: images.data[i].id,
                        url: images.data[i].url,
                        title: images.data[i].title,
                        image: <img alt={images.data[i].title} src={images.data[i].url} width={200} />,
                        action: <ActionButtons id={images.data[i].id} handleDeletion={handleDeletion} />
                    }
                    rows.push(row);
                }
                resolve({
                    total: images.total,
                    data: rows
                });
            }).catch(err => {
                reject(err);
            });
        });
    },[refreshCount, userData]);

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
                active: false
            }
        ]);
    },[setBreadcrumb, title, userData]);

    return (
        <Stack spacing={3}>
            <Alert severity="info">
                This is a demo
            </Alert>
            <div style={{marginLeft: "auto"}}>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={() => history.push("/account/"+userData.currentAccount.id+"/images/create")} >Create Image Link</Button>
                </Stack>
            </div>
            <DataList handleFetch={handleFetch} schema={listFields} />
        </Stack>
    )
}

export default ImageList;