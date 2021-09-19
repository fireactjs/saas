import React, { useState, useContext, useEffect, useRef } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import Loader from "../../../../components/Loader";
import { Paper, Box, Stack, Alert, Typography, Button } from "@mui/material";


const Invite = () => {

    const { code } = useParams();

    const title = 'View Invite';
    const history = useHistory();
    const mountedRef = useRef(true);

    const [invite, setInvite] = useState(null); 
    const [error, setError] = useState(null);
    const [inSubmit, setInSubmit] = useState(false);
    const [success, setSuccess] = useState(false);
    const { setBreadcrumb } = useContext(BreadcrumbContext);

    useEffect(() => {
        setBreadcrumb([
            {
                to: "/",
                text: "Home",
                active: false
            },
            {
                to: null,
                text: title,
                active: true
            }
        ]);
        if(code){
            let isSubscribed = true;
            setError(null);
            const getInvite = CloudFunctions.httpsCallable('getInvite');
            getInvite({
                inviteId: code
            }).then(res => {
                if (!mountedRef.current) return null
                if(isSubscribed){
                    setInvite(res.data);
                }
            }).catch(err => {
                if (!mountedRef.current) return null
                if(isSubscribed){
                    setError(err.message);
                }
            });
            return () => (isSubscribed = false);
        }
    }, [code, setBreadcrumb, title]);

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    return (
        <>
            {success?(
                <Redirect to={"/account/"+invite.accountId+"/"}></Redirect>
            ):(
                <Paper>
                    <Box p={2}>
                        <Stack spacing={3}>
                            {error !== null && 
                                <Alert severity="danger">{error}</Alert>
                            }
                            {invite === null?(
                                <Loader text="Loading the invite..."></Loader>
                            ):(
                                <>
                                    <Typography>This invite will grant you access to <strong>{invite.accountName}</strong>. Do you want to accept it?</Typography>
                                    <Stack direction="row" spacing={1} mt={2}>
                                        <Button disabled={inSubmit} variant="contained" onClick={e => {
                                            e.preventDefault();
                                            setInSubmit(true);
                                            const acceptInvite = CloudFunctions.httpsCallable('acceptInvite');
                                            acceptInvite({
                                                inviteId: code
                                            }).then(res => {
                                                if (!mountedRef.current) return null
                                                setSuccess(true);
                                            }).catch(err => {
                                                if (!mountedRef.current) return null
                                                setError(err.message);
                                            });
                                        }}>{inSubmit && <Loader />}
                                        Yes, accept the invite
                                        </Button>
                                        <Button color="secondary" variant="contained" disabled={inSubmit} onClick={() => history.push('/')}>Ignore</Button>
                                    </Stack>
                                </>
                            )}
                        </Stack>
                    </Box>
                </Paper>
            )}
        </>
    )
}

export default Invite;