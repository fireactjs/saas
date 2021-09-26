import React, { useContext } from "react";
import DataList from '../../../../components/DataList';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { useHistory } from "react-router-dom";
import { ListImageApi } from './ImagesApis';
import { listResponse } from './images.json';
import { Stack, Button } from '@mui/material';

const ImageList = () => {
    const { userData } = useContext(AuthContext);
    const history = useHistory();

    return (
        <Stack spacing={3}>
            <div style={{marginLeft: "auto"}}>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={() => history.push("/account/"+userData.currentAccount.id+"/images/create")} >Create Image Link</Button>
                </Stack>
            </div>
            <DataList title="Images" api={ListImageApi} schema={listResponse} />
        </Stack>
        
    )
}

export default ImageList;