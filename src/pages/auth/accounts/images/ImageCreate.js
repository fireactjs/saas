import React, {useState, useContext, useEffect} from 'react';
import DataCreate from '../../../../components/DataCreate';
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { formSchema } from './images.json';
import { Alert, TextField } from '@mui/material';
import { CreateImageApi } from './ImagesApis';

const ImageCreate = () => {

    const listName = 'images'
    const title = 'Create Image';

    const [formFocused, setFormFocused] = useState(false);
    const [urlError, setUrlError] = useState(null);
    const [titleError, setTitleError] = useState(null);
    const validate = () => {
        return formFocused && !urlError && !titleError;
    }
    const { userData } = useContext(AuthContext);

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
        <DataCreate
            schema = {formSchema}
            validation = {validate}
            success = {<Alert severity="success">Success! No data is saved because the database is a static file. This is just a demo.</Alert>}
            handleCreation = {CreateImageApi}
        >
            <TextField
                label="Image URL"
                name="url"
                fullWidth
                onFocus={() => setFormFocused(true)}
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
                fullWidth
                onFocus={() => setFormFocused(true)}
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
        </DataCreate>
    )

}

export default ImageCreate;