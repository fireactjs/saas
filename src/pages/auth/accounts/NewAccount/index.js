import React, {useState, useContext, useEffect} from "react";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { Form, Input } from '../../../../components/Form';
import { Redirect } from 'react-router-dom';
import { Container, Paper, Box, Alert } from "@mui/material";

const NewAccount = () => {
    const title = 'Create New Account';

    const [accountName, setAccountName] = useState({
        hasError: false,
        error: null,
        value: null
    });

    const [errorMessage, setErrorMessage] = useState(null);

    const [inSubmit, setInSubmit] = useState(false);

    const [redirect, setRedirect] = useState(null);
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
    }, [setBreadcrumb, title]);


    return (
        <Container>
            <Paper>
                <Box p={2}>
            {redirect === null && 
            <>

                            {errorMessage !== null && 
                                <Alert severity="error" dismissible={true} onDismiss={() => setErrorMessage(null)}>{errorMessage}</Alert>
                            }
                            <div className="card-body">
                                <Form handleSubmit={e =>{
                                    e.preventDefault();
                                    setInSubmit(true);
                                    setErrorMessage(null);
                                    const createAccount = CloudFunctions.httpsCallable('createAccount');
                                    createAccount({
                                        accountName: accountName.value,
                                    }).then(response => {
                                        const accountId = response.data.accountId;
                                        setRedirect('/account/'+accountId+'/billing/plan');
                                    }).catch(err => {
                                        setErrorMessage(err.message);
                                        setInSubmit(false);
                                    })
                                }}
                                disabled={accountName.hasError || accountName.value===null || inSubmit}
                                inSubmit={inSubmit}
                                enableDefaultButtons={true}>
                                    <Input label="Account Name" type="text" name="account-name" maxLen={100} required={true} changeHandler={setAccountName} fullWidth variant="outlined" />
                                </Form>
                            </div>

            </>
            }
            {redirect !== null &&
                <Redirect to={redirect}></Redirect>
            }
                </Box>
            </Paper>
        </Container>

    )
}

export default NewAccount;