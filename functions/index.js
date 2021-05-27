const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripeConfig = require('./stripe.json');
const crypto = require('crypto');
const Mailgun = require('mailgun-js');
const mailGunConfig = require('./mailgun.json');
const config = require('./config.json');
const inviteEmailTemplate = require('./invite_email_template.json');

/*
To add new functions for your project, please add your new functions as function groups.
For more details, please read https://firebase.google.com/docs/functions/organize-functions#group_functions
*/

admin.initializeApp();

const log = (uid, activity) => {
    const dt = new Date();
    const data ={
        'action': activity,
        'time': dt
    }
    return admin.firestore().collection('users').doc(uid).collection('activities').doc(String(dt.getTime())).set(data);
}

const getDoc = (docPath) => {
    const docRef = admin.firestore().doc(docPath);
    return docRef.get().then(docSnapshot => {
        if(docSnapshot.exists){
            return docSnapshot;
        }else{
            throw new Error('The document '+docPath+' does not exist');
        }
    });
}

// add account to firestore
const addAccount = (accountData) => {
    let acc = {
        'name':accountData.name,
        'owner': accountData.ownerId,
        'creationTime': new Date()
    }
    return admin.firestore().collection('accounts').add(acc).then(account => {
        return account;
    });
}

const getDocIndexById = (docArray, id) => {
    for(let i=0; i<docArray.length; i++){
        if(docArray[i].id === id){
            return i;
        }
    }
    return -1;
}

const sha256hash = (str) => {
    const hash = crypto.createHash('sha256');
    hash.update(str+":"+config.salt);
    return hash.digest('hex');
}

const sendInviteEmail = (email, senderName, inviteCode) => {
    let mailgun = new Mailgun({
        apiKey: mailGunConfig.api_key,
        domain: mailGunConfig.domain
    });
    let inviteUrl = mailGunConfig.invite_url+"/"+inviteCode;
    if(inviteEmailTemplate.format === 'html'){
        let data = {
            from: mailGunConfig.from,
            to: email,
            subject: inviteEmailTemplate.subject.replace(/{{sender_name}}/g, senderName).replace(/{{site_name}}/g, mailGunConfig.site_name),
            html: inviteEmailTemplate.body.replace(/{{sender_name}}/g, senderName).replace(/{{site_name}}/g, mailGunConfig.site_name).replace(/{{invite_link}}/g, inviteUrl)
        }
        return mailgun.messages().send(data);
    }else{
        let data = {
            from: mailGunConfig.from,
            to: email,
            subject: inviteEmailTemplate.subject.replace(/{{sender_name}}/g, senderName).replace(/{{site_name}}/g, mailGunConfig.site_name),
            text: inviteEmailTemplate.body.replace(/{{sender_name}}/g, senderName).replace(/{{site_name}}/g, mailGunConfig.site_name).replace(/{{invite_link}}/g, inviteUrl)
        }
        return mailgun.messages().send(data);
    }
}

// add a user to the account only when the user is not in the account
const addUserToAccount = (accountId, userId, isAdmin) => {
    return Promise.all([getDoc('accounts/'+accountId), getDoc('users/'+userId)]).then(([account, user]) => {
        if(typeof(account.data().access) === 'undefined' || account.data().access.indexOf(user.id) === -1){
            // add user to account if user doesn't exist
            let access = [];
            let admins = [];
            if(typeof(account.data().access) !== 'undefined'){
                access = account.data().access;
                admins = account.data().admins;
            }
            access.push(user.id);
            if(isAdmin){
                admins.push(user.id);
            }
            return account.ref.set({
                'admins': admins,
                'access': access,
                'adminCount': admins.length,
                'accessCount': access.length
            }, {merge: true});
        }else{
            throw new Error("invalid account ID or user ID");
        }
    }).then(res => {
        return {'result': 'success', 'accountId': accountId}
    });
}

const getStripeCustomerId = (userId, name, email, paymentMethodId) => {
    const stripe = require('stripe')(stripeConfig.secret_api_key);
    let user = null;
    let stripeCustomerId = '';
    return getDoc('users/'+userId).then(userDoc => {
        user = userDoc;
        if(userDoc.data().stripeCustomerId){
            return {
                existing: true,
                id: userDoc.data().stripeCustomerId
            }
        }else{
            // create stripe customer
            return stripe.customers.create({
                name: name,
                email: email,
                description: userId
            });
        }
    }).then(customer => {
        stripeCustomerId = customer.id;
        if(customer.existing){
            return user;
        }else{
            return user.ref.set({
                stripeCustomerId: customer.id
            },{merge: true});
        }
    }).then(res => {
        if(paymentMethodId){
            return stripe.paymentMethods.attach(paymentMethodId, {
                customer: stripeCustomerId
            });
        }else{
            return {
                customer: stripeCustomerId
            }
        }
    }).then(paymentMethod => {
        return paymentMethod.customer;
    });
}

exports.logUserDeletion = functions.auth.user().onDelete(user => {
    return log(user.uid, 'deleted account');
});

exports.logUserCreation = functions.auth.user().onCreate(user => {
    return log(user.uid, 'created account');
});

exports.userActivityCountIncremental = functions.firestore.document('/users/{userId}/activities/{activityId}').onCreate((snap, context) => {
    return admin.firestore().collection('users').doc(context.params.userId).set({'activityCount':admin.firestore.FieldValue.increment(1)},{merge: true});
});

exports.createAccount = functions.https.onCall((data, context) => {
    return addAccount({
        'name':data.accountName,
        'ownerId':context.auth.uid
    }).then(account => {
        log(context.auth.uid, 'created account id: '+account.id);
        return addUserToAccount(account.id, context.auth.uid, true);
    });
});


exports.getAccountUsers = functions.https.onCall((data, context) => {
    let account = null;
    return getDoc('/accounts/'+data.accountId).then(accountRef => {
        account = accountRef;
        if(accountRef.data().admins.indexOf(context.auth.uid) !== -1){
            let getUsers = [];
            accountRef.data().access.forEach(userId => {
                getUsers.push(getDoc('users/'+userId));
            });
            return Promise.all(getUsers);
        }else{
            throw new Error("Permission denied.");
        }
    }).then(users => {
        let records = [];
        users.forEach(user => {
            records.push({
                id: user.id,
                displayName: user.data().displayName,
                photoUrl: user.data().photoURL,
                lastLoginTime: user.data().lastLoginTime.toMillis(),
                role: (account.data().admins.indexOf(user.id)===-1?'user':'admin')
            });
        });
        records.sort((a,b) => a.displayName > b.displayName);
        return records;
    }).catch(err => {
        throw new functions.https.HttpsError('internal', err.message);
    });
});

exports.getAccountUser = functions.https.onCall((data, context) => {
    let account = null;
    return getDoc('/accounts/'+data.accountId).then(accountRef => {
        account = accountRef;
        if(accountRef.data().admins.indexOf(context.auth.uid) !== -1){
            if(accountRef.data().access.indexOf(data.userId) !== -1){
                return getDoc('/users/'+data.userId);
            }else{
                throw new Error("No user with ID: "+data.userId);
            }
        }else{
            throw new Error("Permission denied.");
        }
    }).then(user => {
        return {
            id: user.id,
            displayName: user.data().displayName,
            photoUrl: user.data().photoURL,
            lastLoginTime: user.data().lastLoginTime.toMillis(),
            role: (account.data().admins.indexOf(user.id)===-1?'user':'admin')
        }
    }).catch(err => {
        throw new functions.https.HttpsError('internal', err.message);
    });
});

exports.updateAccountUserRole = functions.https.onCall((data, context) => {
    return Promise.all([getDoc('accounts/'+data.accountId), getDoc('users/'+data.userId)]).then(([account, user]) => {
        if(account.data().admins.indexOf(context.auth.uid) !== -1){
            if(account.data().access.indexOf(data.userId) !== -1){
                switch(data.role){
                    case 'user':
                        if(account.data().admins.indexOf(data.userId) !== -1){
                            let admins = account.data().admins;
                            admins.splice(account.data().admins.indexOf(user.id),1);
                            return account.ref.set({
                                admins: admins,
                                adminCount: admins.length
                            },{merge:true});
                        }else{
                            return {}
                        }
                    case 'admin':
                        if(account.data().admins.indexOf(data.userId) === -1){
                            let admins = account.data().admins;
                            admins.push(user.id);
                            return account.ref.set({
                                admins: admins,
                                adminCount: admins.length
                            },{merge:true});
                        }else{
                            return {}
                        }
                    case 'remove': {
                        let access = account.data().access;
                        access.splice(account.data().access.indexOf(user.id),1);
                        let admins = account.data().admins;
                        if(account.data().admins.indexOf(data.userId) !== -1){
                            admins.splice(account.data().admins.indexOf(user.id),1);
                        }
                        return account.ref.set({
                            access: access,
                            accessCount: access.length,
                            admins: admins,
                            adminCount: admins.length
                        },{merge:true});
                    }
                    default:
                        throw new Error("Invalid role or action.");
                }
            }else{
                throw new Error("No user with ID: "+data.userId);
            }
        }else{
            throw new Error("Permission denied.");
        }
    }).then(writeResult => {
        return {
            result: 'success',
            role: data.role
        }
    }).catch(err => {
        throw new functions.https.HttpsError('internal', err.message);
    });
});

exports.addUserToAccount = functions.https.onCall((data, context) => {
    let account = null;
    return getDoc('/accounts/'+data.accountId).then(accountRef => {
        account = accountRef;
        if(accountRef.data().admins.indexOf(context.auth.uid) !== -1){
            return admin.auth().getUserByEmail(data.email);
        }else{
            throw new Error("Permission denied.");
        }
    }).then(userRecord => {
        if(account.data().access.indexOf(userRecord.uid) === -1){
            // user is found in the system and has no access to the account
            return addUserToAccount(data.accountId, userRecord.uid, data.role==='admin');            
        }else{
            throw new Error("The user already have access to the account.");
        }
    }).then(res => {
        return res;
    }).catch(err => {
        throw new functions.https.HttpsError('internal', err.message, err);
    });
});

exports.inviteEmailToAccount = functions.https.onCall((data, context) => {
    return getDoc('/accounts/'+data.accountId).then(account => {
        if(account.data().admins.indexOf(context.auth.uid) !== -1){
            // write invite record
            const hashedEmail = sha256hash(data.email.trim().toLowerCase())
            return admin.firestore().collection('invites').add({
                hashedEmail: hashedEmail,
                owner: context.auth.uid,
                account: data.accountId,
                role: data.role,
                time: new Date()
            });
        }else{
            throw new Error("Permission denied.");
        }
    }).then(invite => {
        // send email with invite id
        return sendInviteEmail(data.email, context.auth.token.name, invite.id);
    }).then(res => {
        return {
            result: 'success'
        }
    }).catch(err => {
        throw new functions.https.HttpsError('internal', err.message, err);
    });
});

exports.getInvite = functions.https.onCall((data, context) => {
    return getDoc('/invites/'+data.inviteId).then(invite => {
        if(invite.data().hashedEmail === sha256hash(context.auth.token.email.trim().toLowerCase())){
            return getDoc('/accounts/'+invite.data().account);
        }else{
            // the email doesn't match the invite's email address
            throw new Error("Invalid invite details.");
        }
    }).then(account => {
        return {
            accountId: account.id,
            accountName: account.data().name
        }
    }).catch(err => {
        throw new functions.https.HttpsError('internal', err.message);
    });
});


exports.acceptInvite = functions.https.onCall((data, context) => {
    return getDoc('/invites/'+data.inviteId).then(invite => {
        if(invite.data().hashedEmail === sha256hash(context.auth.token.email.trim().toLowerCase())){
            let time = new Date();
            if(invite.data().time.toMillis() > time.setHours(time.getHours()-config.invite_expire)){
                return addUserToAccount(invite.data().account, context.auth.uid, invite.data().role==='admin');
            }else{
                throw new Error("The invite has expired.");
            }
        }else{
            // the email doesn't match the invite's email address
            throw new Error("Invalid invite details.");
        }
    }).then(res => {
        return admin.firestore().doc('/invites/'+data.inviteId).delete();
    }).catch(err => {
        throw new functions.https.HttpsError('internal', err.message);
    });
});

exports.updatePaymentMethod = functions.https.onCall((data, context) => {
    const stripe = require('stripe')(stripeConfig.secret_api_key);
    let account = null;
    return Promise.all([getDoc('/accounts/'+data.accountId),getDoc('/users/'+context.auth.uid)]).then(([accountDoc, userDoc]) => {
        account = accountDoc;
        // attach the payment method to the customer
        if(accountDoc.data().admins.indexOf(context.auth.uid) !== -1){
            if(userDoc.data().stripeCustomerId){
                return stripe.paymentMethods.attach(data.paymentMethodId, {
                    customer: userDoc.data().stripeCustomerId
                });
            }else{
                throw new Error("Subscribe to a plan first.");
            }
        }else{
            throw new Error("Permission denied.");
        }  
    }).then(paymentMethod => {
        // update the subscription payment method
        return stripe.subscriptions.update(
            account.data().stripeActiveSubscriptionID,{
            default_payment_method: paymentMethod.id
        });
    }).then(subscription => {
        return {
            'result': 'success'
        }
    }).catch(err => {
        throw new functions.https.HttpsError('internal', err.message);
    });
});

exports.createSubscription = functions.https.onCall((data, context) => {
    const stripe = require('stripe')(stripeConfig.secret_api_key);
    let account = null;
    let plan = null;
    return Promise.all([getDoc('/accounts/'+data.accountId),getDoc('/plans/'+data.planId)]).then(([accountDoc, planDoc]) => {
        account = accountDoc;
        plan = planDoc;
        if(account.data().admins.indexOf(context.auth.uid) !== -1){
            if(data.paymentMethodId){
                return getStripeCustomerId(context.auth.uid, context.auth.token.name, context.auth.token.email, data.paymentMethodId);
            }else{
                return getStripeCustomerId(context.auth.uid, context.auth.token.name, context.auth.token.email);
            }
        }else{
            throw new Error("Permission denied.");
        }
    }).then(stripeCustomerId => {
        if(plan.data().price !== 0){
            if(plan.data().stripePriceId){
                if(account.data().stripeActiveSubscriptionID){
                    // retrieve subscription
                    return stripe.subscriptions.retrieve(
                        account.data().stripeActiveSubscriptionID
                    );
                }else{
                    // create subscription
                    return stripe.subscriptions.create({
                        customer: stripeCustomerId,
                        default_payment_method: data.paymentMethodId,
                        items: [
                            {price: plan.data().stripePriceId}
                        ]
                    });
                }
            }else{
                throw new Error("No price ID attached to the plan.");
            }
        }else{
            if(account.data().stripeActiveSubscriptionID){
                // retrieve subscription
                return stripe.subscriptions.retrieve(
                    account.data().stripeActiveSubscriptionID
                );             
            }else{
                // create subscription
                return stripe.subscriptions.create({
                    customer: stripeCustomerId,
                    items: [
                        {price: plan.data().stripePriceId}
                    ]
                });
            }
        }
    }).then(subscription => {
        if(account.data().stripeActiveSubscriptionID){
            // update subscription
            if(plan.data().stripePriceId){
                return stripe.subscriptions.update(
                    account.data().stripeActiveSubscriptionID,{
                    default_payment_method: data.paymentMethodId,
                    items: [
                        {
                            id: subscription.items.data[0].id,
                            price: plan.data().stripePriceId
                        }
                    ]
                });
            }else{
                return stripe.subscriptions.update(
                    account.data().stripeActiveSubscriptionID,{
                    items: [
                        {
                            id: subscription.items.data[0].id,
                            price: plan.data().stripePriceId
                        }
                    ]
                });
            }
        }else{
            return subscription;
        }
    }).then(subscription => {
        return account.ref.set({
            plan: plan.ref,
            paymentCycle: plan.data().paymentCycle,
            price: plan.data().price,
            currency: plan.data().currency,
            stripeActiveSubscriptionID: subscription.id,
            subscriptionStatus: subscription.status,
            subscriptionCreated: subscription.created,
            subscriptionCurrentPeriodStart: subscription.current_period_start,
            subscriptionCurrentPeriodEnd: subscription.current_period_end,
            subscriptionEnded: subscription.ended || 0,
            billingCountry: data.billing.country,
            billingOrganisation: data.billing.organisation,
            billingFullName: data.billing.fullName,
            billingStreetAddress: data.billing.streetAddress,
            billingCity: data.billing.city,
            billingZipCode: data.billing.zipCode,
            billingState: data.billing.state
        }, {merge: true});
    }).then(writeResult => {
        return {
            'result': 'success'
        }
    }).catch(err => {
        throw new functions.https.HttpsError('internal', err.message);
    });
});

exports.cancelSubscription = functions.https.onCall((data, context) => {
    const stripe = require('stripe')(stripeConfig.secret_api_key);
    let account = null;
    return getDoc('accounts/'+data.accountId).then(accountDoc => {
        account = accountDoc;
        if(account.data().admins.indexOf(context.auth.uid) !== -1){
            return stripe.subscriptions.del(account.data().stripeActiveSubscriptionID);
        }else{
            throw new Error("Permission denied.");
        }
    }).then(subscription => {
        return account.ref.set({
            subscriptionStatus: subscription.status,
            access:[],
            accessCount: 0,
            admins: [],
            adminCount: 0
        },{merge: true});
    }).then(writeResult => {
        return {
            'result': 'success'
        }
    }).catch(err => {
        throw new functions.https.HttpsError('internal', err.message);
    });
});

const updateInvoice = (invoiceObject) => {
    return admin.firestore().collection('accounts').where('stripeActiveSubscriptionID', '==', invoiceObject.subscription).get().then(snapshot => {
        if(snapshot.empty){
            console.log('[No account found]', invoiceObject.id);
            throw Error("account does not exist with subscription id: "+invoiceObject.subscription);
        }else{
            let actions = [];
            snapshot.forEach(account => {
                console.log('[update invoice]', account.id, invoiceObject.id);
                actions.push(
                    account.ref.collection('invoices').doc(invoiceObject.id).set({
                        'id': invoiceObject.id,
                        'total': invoiceObject.total,
                        'subTotal': invoiceObject.subtotal,
                        'amountDue': invoiceObject.amount_due,
                        'amountPaid': invoiceObject.amount_paid,
                        'tax': invoiceObject.tax,
                        'currency': invoiceObject.currency,
                        'created': invoiceObject.created,
                        'status': invoiceObject.status,
                        'hostedInvoiceUrl': invoiceObject.hosted_invoice_url
                    }, {merge: true})
                );
            });
            return Promise.all(actions);
        }
    }).then(writeResult => {
        return true;
    }).catch(err => {
        throw err;
    })
}

const updateSubscription = (subscriptionObject) => {
    return admin.firestore().collection('accounts').where('stripeActiveSubscriptionID', '==', subscriptionObject.id).get().then(snapshot => {
        if(snapshot.empty){
            throw Error("account does not exist with subscription id: "+subscriptionObject.id);
        }else{
            let actions = [];
            snapshot.forEach(account => {
                actions.push(
                    account.ref.set({
                        subscriptionStatus: subscriptionObject.status,
                        subscriptionCreated: subscriptionObject.created,
                        subscriptionCurrentPeriodStart: subscriptionObject.current_period_start,
                        subscriptionCurrentPeriodEnd: subscriptionObject.current_period_end,
                        subscriptionEnded: subscriptionObject.ended || 0
                    }, {merge: true})
                );
            });
            return Promise.all(actions);
        }
    }).then(writeResult => {
        return true;
    }).catch(err => {
        throw err;
    })
}

exports.stripeWebHook = functions.https.onRequest((req, res) => {
    const stripe = require('stripe')(stripeConfig.secret_api_key);
    const endpointSecret = stripeConfig.endpoint_secret;
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        let result = false;
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
        if(event.type.indexOf('invoice.') === 0){
            result = updateInvoice(event.data.object);
        }
        if(event.type.indexOf('customer.subscription.') === 0){
            result = updateSubscription(event.data.object);
        }
        if(result){
            res.json({received: true});
        }else{
            throw Error("unknown error");
        }
    }catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});