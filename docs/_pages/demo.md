---
permalink: /demo/
title: Demo
toc: true
toc_sticky: true
---
The live demo allows you to experience the following features without the need to setup Fireact in your local computer or deploying to your Firebase project.

### Sign-On Methods

You can sign on with:
- Email and password
- Google account
- Facebook account

The demo supports the above sign-on methods. Fireact supports all single-sign-on methods that Firebase supports, such as Twitter, Linkedin. The additional sign-on methods are not activated in the live demo.

### Subscription Payment

You can create multiple subscription accounts in the demo, including free and paid subscriptions.

For paid subscriptions, please use the testing credit card number from Stripe. The card number is `4242 4242 4242 4242` with any future expiry date and random 3-digit secure code. **DO NOT** use real credit numbers!

### Sales Tax and GST

Fireact supports charging tax based on location. When you test the paid subscription, you can enable the tax rate feature by selecting the following location:
- Selecting `Australia` as the country, `10%` GST will be applied to the subscription payments
- Selecting `United States` as the country and `California` as the state, `7.25%` sales tax will be applied to the subscription payments

### Permission Control

There are two level of user permission in each subscription account, `admin` and `user`. Admins of the subscription account can:
- Add, remove users and change user permissions
- Change the subscription plan and view payment history

You can invite other users to your subscription account. However, due to security reasons, the invite email will not work in the demo. You can still add other users to your subscription account if they have an user account in the demo.

### Launch Live Demo

[Launch Live Demo](https://fireact-e1bdc.firebaseapp.com/){: .btn .btn--success}

