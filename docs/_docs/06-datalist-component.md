---
title: "<DataList> Component"
permalink: /docs/datalist-component/
excerpt: "UI component to list data with pagination"
last_modified_at: 2021-11-05
---

# &lt;DataList&gt; Component

&lt;DataList&gt; component displays data in a table list format with pagination functionality as the screenshot shows below.

![&lt;DataList&gt; component screenshot](/assets/images/datalist-component-screenshot.png)

The component accepts two props: `handleFetch` and `listResponse`.

## handleFetch prop

The `handleFetch` prop is a function that fetches the data for the page. The component passes two variables to the function: `page` and `pageSize`. The `page` variable is the page number. The `pageSize` variable is the number of records per page. The function can be an API call to the backend to fetch data for the list.

In `/src/pages/auth/accounts/images/ImageList.js`, you can find an example of the `handleFetch` function which acts as a medium to the actual API that returns the data. The advantage of this approach is that you can transform the data (e.g. including visual components) before passing the data into the &lt;DataList&gt; component.

The component supplies the function with only two variables: `page` and `pageSize`. If you wish to implement search filters, you will need to add the feature with custom React components and apply the rules in your `handleFetch` function before calling the backend API.


The following code decides to use the static JSON data or use Firestore as the data source.
```
let ListImageApi = useStaticData?ListImageApiStatic:ListImageApiFirestore;
```

`ListImageApiStatic` function reads the image records from the static JSON file `/src/pages/auth/accounts/images/image.json`.

`ListImageApiFirestore` function reads the image records from Firestore. As Firestore doesn't support jumping to a record in the result list, the implementation of pagination is done by loading the records for the next page from Firestore and caching the records. When going back to the previous page, the function simply reads from the cached data without interacting with Firestore. This approach increases the data loading speed as well as saves the costs of reading the data documents from Firestore. Each document is read once only when the users go back and forth. Because there is no easy way to count the total number of image records in Firestore, `total` in the response data is hardcoded to be `-1` so that the users can keep going beyond the end of the record list.

## schema prop

The `schema` prop is a JSON array that describes the columns of the table list. Each object is a column, and each column contains three properties: name, field and style.

- name - The name of the column, which will be displayed in the header row
- field - The property name of the data in the record. The component will populate the column with the record’s data with which the property name is matched.
- style - The style sheet of the column, which is used to control the width of the column

Below is an example of the demo image list schema which defines the list table as 4 columns: "Image", "Image Title", "Image URL" and "Actions".

```
[
    {
        "name": "Image",
        "field": "image",
        "style": {"width": "20%"}
    },
    {
        "name": "Image Title",
        "field": "title",
        "style": {"width": "20%"}
    },
    {
        "name": "Image URL",
        "field": "url",
        "style": {"width": "45%"}
    },
    {
        "name": "Actions",
        "field": "action",
        "style": {"width": "15%"}
    }
]
```

The `field` properties matche the data returned from the `handleFetch` function as the example in `/src/pages/auth/accounts/images/ImageList.js` shows:
```
// loop through the data to add the visual components in to the list
for(let i=0; i<images.data.length; i++){
    const row = {
        id: images.data[i].id,
        url: images.data[i].url,
        title: images.data[i].title,
        image: <img alt={images.data[i].title} src={images.data[i].url} width={200} />,
        action: <ActionButtons id={images.data[i].id} handleDeletion={handleDeletion} />
    }
    rows.push(row);
}
``` 