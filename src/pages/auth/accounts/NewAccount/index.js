import React, {useState, useContext, useEffect} from "react";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { Form, Field, Input } from '../../../../components/Form';
import { Redirect } from 'react-router-dom';
import Alert from "../../../../components/Alert";

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
        <>
            {redirect === null && 
            <>
                <div className="container-fluid">
                    <div className="animated fadeIn">
                        <div className="card">
                            <div className="card-header">
                                {title}
                            </div>
                            {errorMessage !== null && 
                                <Alert type="danger" message={errorMessage} dismissible={true} onDismiss={() => setErrorMessage(null)}></Alert>
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
                                    <Field label="Account Name">
                                        <Input type="text" name="account-name" maxLen={100} required={true} changeHandler={setAccountName} />
                                    </Field>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            }
            {redirect !== null &&
                <Redirect to={redirect}></Redirect>
            }
        </>

    )
}

export default NewAccount;