---
title: "<DataDelete> Component"
permalink: /docs/datadelete-component/
excerpt: "UI component to delete existing data records"
last_modified_at: 2021-11-07
---

# &lt;DataDelete&gt; Component

&lt;DataDelete&gt; component displays a delete button to remove the record in the database. It shows a pop-up dialog to ask for confirmation before calling the deletion API.

![&lt;DataDelete&gt; button screenshot](/assets/images/datadelete-button-screenshot.png)

![&lt;DataDelete&gt; dialog screenshot](/assets/images/datadelete-dialog-screenshot.png)

The component supports the following props:

## id prop

The id prop is the ID of the data record to be edited. It will be passed to the handleEdit function.

## handleDeletion prop

The handleDeletion prop is the API function called to delete the record on the server side.
