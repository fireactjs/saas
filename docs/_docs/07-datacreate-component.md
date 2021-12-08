---
title: "<DataCreate> Component"
permalink: /docs/datacreate-component/
excerpt: "UI component to create new data records"
last_modified_at: 2021-12-08
---

# &lt;DataCreate&gt; Component

&lt;DataCreate&gt; component displays a form to capture the input data and calls a backend API to create the record in the database.

![&lt;DataCreate&gt; component screenshot](/assets/images/datacreate-component.png)

The component can have children components which are the form fields for capturing input data. The fields must have field names because the component matches data by field names. See example code in `/src/pages/auth/accounts/images/ImageCreate.js`

```
<DataCreate
    schema = {formSchema}
    validation = {validate}
    success = {<Alert severity="success">{useStaticData?"Success! No data is saved because the database is a static file. This is just a demo.":"Success! The data is saved."}</Alert>}
    handleCreation = {useStaticData?CreateImageApiStatic:createImageApiFirestore}
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
```

The component supports the following props:

## schema prop

The schema prop is a JSON array of form fields. Each object represents a form field and the name property of the object must match the correspondent field name. The prop property is the attribute name to retrieve data from the field element. See `formSchema` example in `/src/pages/auth/accounts/images/image.json`.

```
"formSchema": [
    {
        "name": "url",
        "prop": "value"
    },
    {
        "name": "title",
        "prop": "value"
    }
]
```

## validation prop

The validation prop is the validation function of the input data. If it returns false, the form will block submission.

## success prop

The success prop contains the component to display a success message after the API created the record successfully.

## handleCreation prop

The handleCreation prop is the API function called on form submission to create the record on the server side. In the demo, if the image title contains “error”, the demo API will return an error to simulate the server side error scenario.

The submission data is an JSON object. The field names are the keys in the JSON object, and the values are passed from the fields.
