import React, { useContext } from "react";
import { Button, Stack } from "@mui/material";
import { images } from "./images.json";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../../components/FirebaseAuth";

const ActionButtons = ({id}) => {
    const history = useHistory();
    const { userData } = useContext(AuthContext);
    const url = '/account/'+userData.currentAccount.id+'/images/edit/'+id;

    return (
        <Stack direction="row" spacing={1} mt={2}>
            <Button variant="contained" onClick={() => history.push(url)}>Edit</Button>
        </Stack>
    )
}

const ListImageApi = (page, pageSize) => {
    return new Promise((resolve, reject) => {
        const start = page * pageSize;
        if(start >= 0 && start < images.length-1){
            let records = [];
            for(let i=start; i<images.length; i++){
                if(images.length<=i || i>=(start+pageSize)){
                    break;
                }
                const record = {
                    url: images[i].url,
                    title: images[i].title,
                    image: <img alt={images[i].title} src={images[i].url+"&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"} width={200} />,
                    action: <ActionButtons id={i} />
                }
                records.push(record);
            }
            setTimeout(() =>
                resolve({
                    total: images.length,
                    data: records
                }), 2000);
        }else{
            reject('out of range');
        }
    });
}

const GetImageApi = (id) => {
    return new Promise((resolve, reject) => {
        if(id >= 0 && id<images.length){
            setTimeout(() =>
                resolve(images[id]), 2000);
        }else{
            reject('out of range');
        }
    })
}

const CreateImageApi = (data) => {
    return new Promise((resolve, reject) => {
        if(data.title.indexOf('error') === -1){
            setTimeout(() => resolve("success"), 2000);
        }else{
            reject("This is an error demo");
        }
    })
}

const EditImageApi = (id, data) => {
    return new Promise((resolve, reject) => {
        if(id >= 0 && id<images.length){
            if(data.title.indexOf('error') === -1){
                setTimeout(() => resolve("success"), 2000);
            }else{
                reject("This is an error demo");
            }
        }else{
            reject('out of range');
        }
        
    })
}

export {
    ListImageApi,
    CreateImageApi,
    GetImageApi,
    EditImageApi
}