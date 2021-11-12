---
title: "<DataList> Component"
permalink: /docs/datalist-components/
excerpt: "UI component to list data with pagination"
last_modified_at: 2021-11-05
---

# &lt;DataList&gt; Component

&lt;DataList&gt; component displays data in a table list format with pagination functionality as the screenshot shows below.

![&lt;DataList&gt; component screenshot](/assets/images/datalist-component-screenshot.png)

The component accepts two props: `handleFetch` and `listResponse`.

## handleFetch prop

The handleFetch prop is a function that fetches the data for the page. The component passes two variables to the function: page and pageSize. The page variable is the page number. The pageSize variable is the number of records per page. The function can be an API call to the backend to fetch data for the list.

In `/src/pages/auth/accounts/images/ImageList.js`, you can find an example of the `handleFetch` function which acts as a medium to the actual API that returns the data. The advantage of this approach is that you can transform the data (e.g. including visual components) before passing the data into the &lt;DataList&gt; component.

The component supplies the function with only two variables: `page` and `pageSize`. If you wish to implement search filters, you will need to add the feature with custom React components and apply the rules in your handleFetch function before calling the backend API.

## schema prop

The schema prop is a JSON array that describes the columns of the table list. Each object is a column, and each column contains three properties: name, field and style.

- name - The name of the column, which will be displayed in the header row
- field - The property name of the data in the record. The component will populate the column with the record’s data with which the property name is matched.
- style - The style sheet of the column, which is used to control the width of the column
