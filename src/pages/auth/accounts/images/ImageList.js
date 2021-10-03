import React, { useContext, useEffect } from "react";
import DataList from '../../../../components/DataList';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { useHistory } from "react-router-dom";
import { ListImageApi } from './ImagesApis';
import { listResponse } from './images.json';
import { Stack, Button } from '@mui/material';

const ImageList = () => {
    const title = "Images";
    const { userData } = useContext(AuthContext);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    const history = useHistory();

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
            <div style={{marginLeft: "auto"}}>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={() => history.push("/account/"+userData.currentAccount.id+"/images/create")} >Create Image Link</Button>
                </Stack>
            </div>
            <DataList handleFetch={ListImageApi} schema={listResponse} />
        </Stack>
        
    )
}

export default ImageList;