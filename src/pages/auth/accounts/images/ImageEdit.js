import React, {useState, useContext, useEffect, useRef } from 'react';
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import imagesJson from './images.json';
import { Alert, Paper, Box, TextField } from '@mui/material';
import { EditImageApiStatic, GetImageApiStatic } from './ImagesApis';
import { useParams } from 'react-router';
import DataEdit from '../../../../components/DataEdit';
import Loader from '../../../../components/Loader';
import { FirebaseAuth } from '../../../../components/FirebaseAuth/firebase';

const ImageEdit = () => {
    const mountedRef = useRef(true);

    const listName = 'images'
    const title = 'Edit Image';

    const useStaticData = imagesJson.useStaticData;
    const formSchema = imagesJson.formSchema;

    const [urlError, setUrlError] = useState(null);
    const [titleError, setTitleError] = useState(null);
    const validate = () => {
        return !urlError && !titleError;
    }
    const { userData } = useContext(AuthContext);
    const { imageId } = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const titleCase = (str) => {
        let splitStr = str.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' '); 
    }

    const { setBreadcrumb } = useContext(BreadcrumbContext);
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
                to: "/account/"+userData.currentAccount.id+"/"+listName,
                text: titleCase(listName),
                active: false
            },
            {
                to: null,
                text: title,
                active: true
            }
        ]);
        setIsLoading(true);
        if(useStaticData){
            GetImageApiStatic(imageId).then(data => {
                if (!mountedRef.current) return null
                setData(data);
                setIsLoading(false);
            })
        }else{
            const Firestore = FirebaseAuth.firestore();
            const DocRef = Firestore.doc('/accounts/'+userData.currentAccount.id+'/images/'+imageId);
            DocRef.get().then(doc => {
                if (!mountedRef.current) return null
                setData(doc.data());
                setIsLoading(false);
            })
        }
        
    },[setBreadcrumb, title, listName, userData, imageId]);

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    const EditImageApiFirestore = (id, data) => {
        const Firestore = FirebaseAuth.firestore();
        const DocRef = Firestore.doc('/accounts/'+userData.currentAccount.id+'/images/'+id);
        return DocRef.set(data, {merge: true});
    }

    return (
        <>
        {isLoading?(
            <Paper>
                <Box p={2}>
                    <Loader text="Loading..." />
                </Box>
            </Paper>
        ):(
            <DataEdit
                id = {imageId}
                schema = {formSchema}
                validation = {validate}
                success = {<Alert severity="success">{useStaticData?"Success! No data is saved because the database is a static file. This is just a demo.":"Success! The data is updated."}</Alert>}
                handleEdit = {useStaticData?EditImageApiStatic:EditImageApiFirestore}
            >
                <TextField
                    label="Image URL"
                    name="url"
                    defaultValue={data.url}
                    fullWidth
                    onBlur={(e) => {
                        if(!/^(http|https):\/\/[^ "]+$/.test(e.target.value) || e.target.value.length > 500){
                            setUrlError("Image URL must be a valid full URL less than 500 characters long.");
                        }else{
                            setUrlError(null);
                        }
                    }}
                    error={urlError?true:false}
                    helperText={urlError}
                />
                <TextField
                    label="Image Title"
                    name="title"
                    defaultValue={data.title}
                    fullWidth
                    onBlur={(e) => {
                        if(e.target.value.trim().length < 1 || e.target.value.trim().length > 100){
                            setTitleError("Image Title must be between 1 to 100 characters.");
                        }else{
                            setTitleError(null);
                        }
                    }}
                    error={titleError?true:false}
                    helperText={titleError}
                />
            </DataEdit>
        )}
        </>
    )

}

export default ImageEdit;