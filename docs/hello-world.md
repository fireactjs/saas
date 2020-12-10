# Hello World

This page will walk you through how to create your SaaS application based on Fireact.

First of all, you will need to install Fireact following [the installation instructions](/installation.md).

Once your instance of Fireact is up and running, sign in to the system. It will redirect you to create an subscription account. Subscribe to any of the plans available in your system, and you will see the Overview page of the subscription account.

Our goal is to change this page to display information relevant to the account and the user. Once you understand how to retrieve the account and the user data, you will be able to develop the functionalities your SaaS needs.

## Loading Account Data

Each subscription account has an ID, which you can find in the `accounts` collection in Firestore. And account data is stored in the account document.

In the front-end, the page URL of each subscription account contains the account ID. When the page is loaded, the system loads the template and the template loads the account data from Firestore.

The Firestore rules limit the access of the account document to the account users only. If the current user has access to the account, the template will load the account data to `userData` context object.

## The Overview Page File

To edit the overview page of the accounts, open `src/pages/auth/accounts/Overview/index.js`

The userData context is already loaded in the `Overview` object, so you can use it directly.

The following code shows the default message. It also shows a link to the plans page for the user to subscribe a plan if no plan is assigned to the account yet. In reality, the subscription link will never be shown because a redirect to the subscription plan page is already in action in the template level once the account data is loaded. The code is purely for demostration purpose.

```
<div className="card-body">
    <p>This is the overview of the account</p>
    {!userData.currentAccount.subscriptionStatus &&
    <p>Account status is not active,
        <Link to={"/account/"+userData.currentAccount.id+"/plan"}>
        activate a plan here to continue</Link>.
    </p>}
</div>
```

`userData.currentAccount` object contains the data of the subscription account loaded by the ID in the URL. Here is an example of the object:

```
currentAccount: {
    id: "cl7xpEKtdc24EAWFLxLj", // unique ID of the account
    name: "my company", // name of the account
    planId: "Nb6BMmxa1k60ztpTQV29", // ID of the subscription plan
    price: 0, // subscription plan price (0 means free plan)
    currency: "usd", // currency of the price
    paymentCycle: "mo", // subscription cycle
    subscriptionStatus: "active", // subscription status
    subscriptionCurrentPeriodEnd: 1607833927, // timestamp of the end of the current subscription period
    role: "admin" // user role
}
```
## Display Subscription Details For Admin Only

Let's try to replace the `card-body` DIV code with the following example:

```
<div className="card-body">
    <p>Hello World</p>
    {userData.currentAccount.role === 'admin' &&
    <p>
        You are paying {userData.currentAccount.price}{userData.currentAccount.currency} per {userData.currentAccount.paymentCycle}
    </p>}
</div>
```

Now, the default message is changed to "Hello World", and the page is able to display the account subscription details including price, currency and payment cycle to admins of the account only.