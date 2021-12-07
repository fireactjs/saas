---
title: "Demo Data Explained"
permalink: /docs/demo-data-explained/
excerpt: "The demo data"
last_modified_at: 2021-11-05
---

After you create a demo account in the system, you will see a list of images as a demo application to showcase how Fireact interacts with databases.

The demo application is powered by the data in `/src/pages/auth/accounts/images/image.json`, a static JSON file that contains the image URLs and titles. As the data is stored in a static file, you cannot create, modify or delete any image records. The purpose of the demo is to showcase how the Fireact data components work with APIs to connect with databases. Follow the instructions to replace the static JSON data file with Firestore, which will allow you to create, modify and delete image records.

- &lt;DataList&gt; component: list data with pagination
- &lt;DataCreate&gt; component: create data record
- &lt;DataEdit&gt; component: modify data records
- &lt;DataDelete&gt; component: delete data records

# Switch to Firestore

You can switch the static dataset to Firestore database, which will allow users to create, modify and delete image records. The switch can be activated by simply changing the `useStaticData` property to `false` in the file `/src/pages/auth/accounts/images/image.json`.


Use the static data set:
```
{
    ...
    "useStaticData": true
}
```

Use Firestore as database:
```
{
    ...
    "useStaticData": false
}
```

Firestore is NoSQL database in the Firebase infrastructure. It is used in the demo code to demonstrate how to communicate with backend database via APIs. You can use any database to support the backend to build your own SaaS application with Fireact.

The demo application stores data in `accounts\{accountId}\images` collection. Each image record is a Firestore document in the collection. The [live demo](https://demo.fireact.dev) doesn't support using Firestore as database. To experience the demo feature, you must install an instance of Fireact in your own Firebase project, and update the `/src/pages/auth/accounts/images/image.json` file as above.