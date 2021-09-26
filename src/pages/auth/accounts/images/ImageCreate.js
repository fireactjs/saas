import React, {useState} from 'react';
import DataCreate from '../../../../components/DataCreate';
import { formSchema } from './images.json';
import { Alert, TextField } from '@mui/material';
import { CreateImageApi } from './ImagesApis';

const ImageCreate = () => {

    const [formFocused, setFormFocused] = useState(false);
    const [urlError, setUrlError] = useState(null);
    const [titleError, setTitleError] = useState(null);
    const validate = () => {
        return formFocused && !urlError && !titleError;
    }

    return (
        <DataCreate
            schema = {formSchema}
            title = "Create Image"
            listName = "images"
            validation = {validate}
            success = {<Alert severity="success">Success! No data is saved because the database is a static file. This is just a demo.</Alert>}
            api = {CreateImageApi}
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