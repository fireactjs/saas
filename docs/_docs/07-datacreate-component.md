---
title: "<DataCreate> Component"
permalink: /docs/datacreate-components/
excerpt: "UI component to create new data records"
last_modified_at: 2021-11-07
---

# &lt;DataCreate&gt; Component

&lt;DataCreate&gt; component displays a form to capture the input data and calls a backend API to create the record in the database.

![&lt;DataCreate&gt; component screenshot](/assets/images/datacreate-component.png)

The component can have children components which are the form fields for capturing input data. The fields must have field names because the component matches data by field names. See example code in 1`/src/pages/auth/accounts/images/ImageCreate.js`

The component supports the following props:

## schema prop

The schema prop is a JSON array of form fields. Each object represents a form field and the name property of the object must match the correspondent field name. The prop property is the attribute name to retrieve data from the field element.

## validation prop

The validation prop is the validation function of the input data. If it returns false, the form will not allow submission.

## success prop

The success prop contains the component to display a success message after the API created the record successfully.

## handleCreation prop

The handleCreation prop is the API function called on form submission to create the record on the server side. In the demo, if the image title contains “error”, the demo API will return an error to simulate the server side error scenario.

