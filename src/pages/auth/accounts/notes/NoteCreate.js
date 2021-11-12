import React, { useState, useContext, useEffect } from 'react';
import { Alert, FormControlLabel, Switch, TextField } from '@mui/material';
import firebase from "firebase/app";
import { Paper, Box, Stack, Button } from '@mui/material';
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { note } from "./note.json";
import { FirebaseAuth } from '../../../../components/FirebaseAuth/firebase';
import Loader from '../../../../components/Loader';

const NoteCreate = () => {
    const { userData } = useContext(AuthContext);

    const validation = () => {
        return formFocused && !subjectError;
    }

    const createApi = (data) => {
        const serverValidation = new Promise((resolve, reject) => {
            if(data.subject !== ""){
                resolve('success');
            }else{
                reject('subject is empty.');
            }
        });
        return serverValidation.then(() => {
            return FireStoreCreateDoc('/accounts/'+userData.currentAccount.id+'/notes', data);
        }).then(() => {
            return "success";
        }).catch(err => {
            throw(err);
        });
    }

    const [subjectError, setSubjectError] = useState(null);
    const [formFocused, setFormFocused] = useState(false);

    return (
        <Create title="Create Note" schema={note} validation={validation} api={createApi} success={<Alert severity="success">Note is created</Alert>}>
            <TextField
                label="Subject"
                name="subject"
                fullWidth
                onFocus={() => setFormFocused(true)}
                onBlur={(e) => {
                    if(e.target.value.length < 3 || e.target.value.length > 100){
                        setSubjectError("Subject line must be between 3 to 100 characters");
                    }else{
                        setSubjectError(null);
                    }
                }}
                error={subjectError?true:false}
                helperText={subjectError}
            />
            <FormControlLabel control={<Switch />} label="Featured" name="featured" />
        </Create>
    )
}

const FireStoreCreateDoc = (path, data) => {
    const Firestore = FirebaseAuth.firestore();
    const colRef = Firestore.collection(path);
    data.createAt = firebase.firestore.FieldValue.serverTimestamp();
    data.lastUpdateAt = firebase.firestore.FieldValue.serverTimestamp();
    return colRef.add(data);
}

const Create = ({schema, title, validation, api, success, children}) => {

    const { userData } = useContext(AuthContext);

    const [inSubmit, setInSubmit] = useState(false);
    const [result, setResult] = useState({
        response: null,
        error: null
    });

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
                to: "/account/"+userData.currentAccount.id+"/notes",
                text: "Notes",
                active: false
            },
            {
                to: null,
                text: title,
                active: true
            }
        ]);
    },[setBreadcrumb, title, userData]);

    return (
        <form onSubmit={e => {
            e.preventDefault();
            setInSubmit(true);
            if(validation()){
                let data = {};
                schema.forEach(field => {
                    data[field.name] = e.target.elements[field.name][field.prop]
                });
                api(data).then(res => {
                    setResult({
                        response: true,
                        error: null
                    });
                    setInSubmit(false);
                }).catch(err => {
                    setResult({
                        response: false,
                        error: err
                    });
                    setInSubmit(false);
                })
            }else{
                setResult({
                    response: false,
                    error: 'Please fill in the form in the correct format.'
                })
                setInSubmit(false);
            }
            
        }}>
            <Paper>
                <Box p={2}>
                    <Stack spacing={3}>
                        {result.response?(
                            <>{success}</>
                        ):(
                            <>
                            {result.response === false && 
                                <Alert severity="error">{result.error}</Alert>
                            }
                            {children}
                            <Stack direction="row" spacing={1} mt={2}>
                                <Button variant="contained" type="submit" disabled={inSubmit}>{inSubmit && <Loader />} Create</Button>
                            </Stack>
                            </>
                        )}
                    </Stack>
                </Box>
            </Paper>
        </form>
    )
}

export default NoteCreate;