import { images } from "./images.json";

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
                    image: <img alt={images[i].title} src={images[i].url+"&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"} width={200} />
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

const CreateImageApi = (data) => {
    return new Promise((resolve, reject) => {
        if(data.title.indexOf('error') === -1){
            setTimeout(() => resolve("success"), 2000);
        }else{
            reject("This is an error demo");
        }
    })
}

export {
    ListImageApi,
    CreateImageApi
}