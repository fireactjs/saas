---
title: "Permission and Account Data"
permalink: /docs/permission-and-account-data/
excerpt: "Apply permission check and retrieve account data"
last_modified_at: 2022-07-15
---
To access the feature modules, users must have access to the subscription account. The account admins can add users via the account user management interface.

## Retrieve account data

In your feature logic, you might need to access the correct active account data. There is `userData` context variable that is designed to store data for the user. The account data is stored in the context variable as `userData.currentAccount`. Below is an example of the object:

```json
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

## Example

Below is an example of displaying the account price information when the user is an admin of the current active account.

```jsx
import { AuthContext } from '../../FirebaseAuth';

const MyComponent = () => {
  const { userData } = useContext(AuthContext);

  return (
    <div className="card-body">
      <p>Hello World</p>
      {userData.currentAccount.role === 'admin' &&
        <p>You are paying {userData.currentAccount.price}{userData.currentAccount.currency} per {userData.currentAccount.paymentCycle}</p>
      }
    </div>
  );
}
export default MyComponent;
```