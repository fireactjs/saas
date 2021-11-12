import React, { useState, useEffect, useRef } from 'react';
import { Alert } from '@mui/material';
import { Paper, Box, Stack, Button } from '@mui/material';
import Loader from '../Loader';

const DataEdit = ({id, schema, validation, handleEdit, success, children}) => {

    const mountedRef = useRef(true);

    const [inSubmit, setInSubmit] = useState(false);
    const [result, setResult] = useState({
        response: null,
        error: null
    });

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    return (
        <form onSubmit={e => {
            e.preventDefault();
            setInSubmit(true);
            if(validation()){
                let data = {};
                schema.forEach(field => {
                    data[field.name] = e.target.elements[field.name][field.prop]
                });
                handleEdit(id, data).then(res => {
                    if (!mountedRef.current) return null
                    setResult({
                        response: true,
                        error: null
                    });
                    setInSubmit(false);
                }).catch(err => {
                    if (!mountedRef.current) return null
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
                            <Button variant="contained" type="submit" disabled={inSubmit}>{inSubmit && <Loader />} Save</Button>
                        </Stack>
                        </>
                    )}
                    </Stack>
                </Box>
            </Paper>
        </form>
    )
}

export default DataEdit;