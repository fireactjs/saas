---
title: "<DataEdit> Component"
permalink: /docs/dataedit-components/
excerpt: "UI component to edit existing data records"
last_modified_at: 2021-11-07
---

# &lt;DataEdit&gt; Component

&lt;DataEdit&gt; component displays a form to capture the input data and calls a backend API to edit the record in the database.

![&lt;DataEdit&gt; component screenshot](/assets/images/dataedit-component.png)

The component can have children components which are the form fields for capturing input data. The fields must have field names because the component matches data by field names. Please note that the component doesn’t populate the data of the record to be edited to the fields. You must do this with your own code similar to the example in `src/pages/auth/accounts/images/ImageEdit.js`.

The component supports the following props:

## id prop

The id prop is the ID of the data record to be edited. It will be passed to the handleEdit function.

## schema prop

The schema prop is a JSON array of form fields. Each object represents a form field and the name property of the object must match the correspondent field name. The prop property is the attribute name to retrieve data from the field element.

## validation prop

The validation prop is the validation function of the input data. If it returns false, the form will not allow submission.

## success prop

The success prop contains the component to display a success message after the API created the record successfully.

## handleEdit prop

The handleEdit prop is the API function called on form submission to edit the record on the server side. In the demo, if the image title contains “error”, the demo API will return an error to simulate the server side error scenario.


