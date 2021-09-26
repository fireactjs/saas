import React, { useState, useContext, useEffect } from 'react';
import { Alert } from '@mui/material';
import { Paper, Box, Stack, Button } from '@mui/material';
import { BreadcrumbContext } from '../Breadcrumb';
import { AuthContext } from "../FirebaseAuth";
import Loader from '../Loader';

const DataCreate = ({schema, title, listName, validation, api, success, children}) => {

    const { userData } = useContext(AuthContext);

    const [inSubmit, setInSubmit] = useState(false);
    const [result, setResult] = useState({
        response: null,
        error: null
    });

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
    },[setBreadcrumb, title, listName, userData]);

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

export default DataCreate;