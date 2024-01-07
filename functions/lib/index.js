const functions = require('firebase-functions');
const admin = require('firebase-admin');

module.exports = function(config){

    /**
     * Get Firestore document by the given document path.
     * @param {string} docPath 
     * @returns {Firestore Document}
     */
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

    /**
     * Get the Stripe customer ID of the given Firebase user ID. If the user doesn't have a Stripe customer ID, it will create one in Stripe and attached the payment method to it.
     * @param {string} userId 
     * @param {string} name 
     * @param {string} email 
     * @param {string} paymentMethodId (optional)
     * @returns {string} Stripe customer ID
     */
    const getStripeCustomerId = (userId, name, email, paymentMethodId, billingDetails) => {
        const stripe = require('stripe')(config.stripe.secret_api_key);
        let user = null;
        let stripeCustomerId = '';
        return getDoc('users/'+userId).then(userDoc => {
            user = userDoc;
            let data = {
                name: name,
                email: email                 
            }
            if(billingDetails){
                data.address = {
                    line1: billingDetails.address.line1,
                    line2: billingDetails.address.line2,
                    city: billingDetails.address.city,
                    postal_code: billingDetails.address.postal_code,
                    state: billingDetails.address.state,
                    country: billingDetails.address.country
                }
                data.description="Contact: "+data.name;
                data.metadata = {
                    contact_name: data.name,
                    firebase_uid: userId
                }
                data.name = billingDetails.name; // business name replaces user name
            }
            if(userDoc.data().stripeCustomerId){
                // update stripe customer
                return stripe.customers.update(userDoc.data().stripeCustomerId, data);
            }else{
                // create stripe customer
                if(paymentMethodId){
                    data.payment_method = paymentMethodId
                }
                return stripe.customers.create(data);
            }
        }).then(customer => {
            stripeCustomerId = customer.id;
            let updateUserData = {
                stripeCustomerId: customer.id
            }
            if(billingDetails){
                updateUserData.billingDetails = billingDetails
            }
            return user.ref.set(updateUserData, {merge: true});
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
        }).then(res => {
            return stripeCustomerId;
        });
    }

    /**
     * Add a user to a subscription
     * @param {string} subscriptionId 
     * @param {string} userId 
     * @param {[]string} permissions 
     * @returns 
     */
    const addUserToSubscription = (subscriptionId, userId, permissions) => {
        return Promise.all([getDoc('subscriptions/'+subscriptionId), getDoc('users/'+userId)]).then(([subscription, user]) => {
            let subPermissions = {} // init permissiones for the subscription
            if(typeof(subscription.data().permissions) !== 'undefined'){
                subPermissions = subscription.data().permissions
            }
            for(let i=0; i<permissions.length; i++){
                if(typeof(subPermissions[permissions[i]]) !== 'undefined'){
                    if(subPermissions[permissions[i]].indexOf(userId) === -1){
                        // the permission level exists and push the user ID to the permission level
                        subPermissions[permissions[i]].push(userId);
                    }
                }else{
                    subPermissions[permissions[i]] = [];
                    subPermissions[permissions[i]].push(userId);
                }
            }
            return subscription.ref.set({
                permissions: subPermissions
            }, {merge: true});
        }).then(res => {
            return {'result': 'success', 'subscriptionId': subscriptionId}
        });
    }

    const getDefaultPermission = () => {
        let permission = "";
        for (let p in config.permissions){
            if(config.permissions[p].default){
                permission = p;
                break;
            }
        }
        return permission;
    }

    const getAdminPermission = () => {
        let permission = "";
        for (let p in config.permissions){
            if(config.permissions[p].admin){
                permission = p;
                break;
            }
        }
        return permission;
    }

    const getPermissions = (permissions, userId) => {
        const grantedPermissions = [];
        for (let p in permissions){
            if(permissions[p].indexOf(userId) !== -1){
                grantedPermissions.push(p);
            }
        }
        return grantedPermissions;
    }


    const getUserByEmail = (email) => {
        return admin.auth().getUserByEmail(email).then(user => {
            return user;
        }).catch(error => {
            return null;
        })
    }

    const updateInvoice = (invoiceObject) => {
        return admin.firestore().collection('subscriptions').where('stripeSubscriptionId', '==', invoiceObject.subscription).get().then(snapshot => {
            if(snapshot.empty){
                throw Error("No subscription is associated with the Stripe subscription ID: "+invoiceObject.subscription);
            }else{
                let actions = [];
                snapshot.forEach(subscription => {
                    actions.push(
                        subscription.ref.collection('invoices').doc(invoiceObject.id).set({
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
        return admin.firestore().collection('subscriptions').where('stripeSubscriptionId', '==', subscriptionObject.id).get().then(snapshot => {
            if(snapshot.empty){
                throw Error("No subscription is associated with the Stripe subscription ID: "+subscriptionObject.id);
            }else{
                let actions = [];
                snapshot.forEach(subscription => {
                    actions.push(
                        subscription.ref.set({
                            subscriptionStatus: subscriptionObject.status,
                            paymentMethod: subscriptionObject.default_payment_method,
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


    return {
        /**
         * create a subscription
         */
        createSubscription: functions.https.onCall((data, context) => {
            const stripe = require('stripe')(config.stripe.secret_api_key);
            const paymentMethodId = data.paymentMethodId || null;
            const billingDetails = data.billingDetails || null;
            let selectedPlan = (config.plans.find(obj => obj.id === data.planId) || {});
            if(selectedPlan.legacy){
                throw new functions.https.HttpsError('internal', "The plan is not available.");
            }
            return getStripeCustomerId(
                context.auth.uid,
                context.auth.token.name,
                context.auth.token.email,
                paymentMethodId,
                billingDetails
            ).then(stripeCustomerId => {
                // create subscription
                const items = [];
                for (const index in selectedPlan.priceIds){
                    items.push({
                        price: selectedPlan.priceIds[index]
                    });
                }
                const data = {
                    customer: stripeCustomerId,
                    items: items
                }
                if(selectedPlan.free === false){
                    data.default_payment_method = paymentMethodId;
                }
                return stripe.subscriptions.create(data);
            }).then(subscription => {
                // init permissions
                const permissions = {}
                for (let p in config.permissions){
                    // grant all permissions to the current user
                    permissions[p] = [];
                    permissions[p].push(context.auth.uid);
                }
                // get items from the subscription and their price IDs
                let items = {};
                for(const index in subscription.items.data){
                    const item = subscription.items.data[index];
                    if(item.price && item.price.id){
                        if(selectedPlan.priceIds.indexOf(item.price.id) === -1){
                            throw new Error("Invalid price ID in a subscription item.");
                        }else{
                            items[item.price.id] = item.id;
                        }
                    }else{
                        throw new Error("Missing price ID in a subscription item.");
                    }
                }
                const sub = {
                    plan: selectedPlan.title, // title of the plan
                    stripeItems: items, // price ID in stripe
                    paymentCycle: selectedPlan.frequency,
                    planId: selectedPlan.id, // plan ID
                    currency: selectedPlan.currency,
                    stripeSubscriptionId: subscription.id,
                    subscriptionStatus: subscription.status,
                    subscriptionCreated: subscription.created,
                    subscriptionCurrentPeriodStart: subscription.current_period_start,
                    subscriptionCurrentPeriodEnd: subscription.current_period_end,
                    subscriptionEnded: subscription.ended || 0,
                    ownerId: context.auth.uid,
                    permissions: permissions,
                    paymentMethod: subscription.default_payment_method,
                    creationTime: (new Date())
                    //billingCountry: data.billing.country,
                    //billingState: data.billing.state                    
                }
                return admin.firestore().collection('subscriptions').add(sub);
            }).then(sub => {
                return {
                    subscriptionId: sub.id
                }
            }).catch(error => { 
                throw new functions.https.HttpsError('internal', error.message);
            });
        }),

        getSubscriptionUsers: functions.https.onCall((data, context) => {
            const result = {
                total: 0,
                users: []
            }
            let permissions = [];
            return getDoc("subscriptions/"+data.subscriptionId).then(subRef => {
                // check if the user is an admin level user
                if(subRef.data().ownerId === context.auth.uid || subRef.data().permissions[getAdminPermission()].indexOf(context.auth.uid) !== -1){
                    const userList = subRef.data().permissions[getDefaultPermission()];
                    permissions = subRef.data().permissions;
                    // get total
                    result.total = userList.length;
                    if(result.total === 0){
                        return {
                            empty: true
                        }
                    }else{
                        // query user data
                        const usersRef = admin.firestore().collection("users");
                        const invitesRef = admin.firestore().collection("invites").where("subscriptionId", "==", data.subscriptionId);
                        return Promise.all([usersRef.where(admin.firestore.FieldPath.documentId(), "in", userList).get(), invitesRef.get()]);
                    } 
                }else{
                    throw new Error("Permission denied.");
                }
            }).then(([usersSnapshot, invitesSnapshot]) => {
                if(!usersSnapshot.empty){
                    // return users
                    usersSnapshot.forEach(user => {
                        result.users.push({
                            id: user.id,
                            displayName: user.data().displayName,
                            photoURL: user.data().photoURL,
                            email: user.data().email,
                            permissions: getPermissions(permissions, user.id),
                            type: 'user'
                        });
                    });
                }
                if(!invitesSnapshot.empty){
                    invitesSnapshot.forEach(invite => {
                        result.users.push({
                            id: invite.id,
                            displayName: invite.data().displayName,
                            photoURL: null,
                            email: invite.data().email,
                            permissions: invite.data().permissions,
                            type: 'invite'
                        })
                    })
                }
                return result;
            }).catch(err => {
                throw new functions.https.HttpsError('internal', err.message);
            });
        }),

        inviteUser: functions.https.onCall((data, context) => {
            let subDoc = null;
            let inviteId = null;
            return getDoc("subscriptions/"+data.subscriptionId).then(subRef => {
                // check if the user is an admin level user
                subDoc = subRef;
                if(subRef.data().ownerId === context.auth.uid || subRef.data().permissions[getAdminPermission()].indexOf(context.auth.uid) !== -1){
                    return getUserByEmail(data.email);
                }else{
                    throw new Error("Permission denied.");
                }
            }).then(user => {
                if(user !== null){
                    if(subDoc.data().permissions[getDefaultPermission()].indexOf(user.uid) !== -1){
                        throw new Error("The user already have access.");
                    }
                }
                return admin.firestore().collection('invites').where('email', '==', data.email).where('subscriptionId', '==', data.subscriptionId).get();
            }).then(subSnapshot => {
                if(subSnapshot.empty){
                    return admin.firestore().collection('invites').add({
                        email: data.email,
                        subscriptionId: data.subscriptionId,
                        displayName: data.displayName,
                        permissions: data.permissions,
                        subscriptionName: subDoc.data().name || "",
                        sender: context.auth.token.name,
                        creationTime: (new Date())
                    });
                }else{
                    throw new Error("Duplicate invite.");
                }
            }).then((invite) => {
                inviteId = invite.id;
                if(config.mailgun){
                    const formData = require('form-data');
                    const Mailgun = require('mailgun.js');
                    const mailgun = new Mailgun(formData);
                    const mg = mailgun.client({username: 'api', key: config.mailgun.api_key});
                    const mailData = {
                        from: config.mailgun.from,
                        to: data.email,
                        subject: data.displayName+", you are invited to "+config.site_name,
                        template: config.mailgun.templates.invite_email,
                        'h:X-Mailgun-Variables': JSON.stringify({
                            'sender': context.auth.token.name,
                            'site_name': config.site_name,
                            'name': data.displayName,
                            'sign_in_url': config.sign_in_url,
                            'sign_up_url': config.sign_up_url
                        })
                    }
                    return mg.messages.create(config.mailgun.domain, mailData);
                }else{
                    // skip invite email
                    return {}
                }
            }).then(invite => {
                return {
                    inviteId: inviteId
                }
            }).catch(err => {
                throw new functions.https.HttpsError('internal', err.message);
            });
        }),

        revokeInvite: functions.https.onCall((data, context) => {
            return Promise.all([getDoc("subscriptions/"+data.subscriptionId), getDoc("invites/"+data.inviteId)]).then(([subRef, inviteRef]) => {
                // check if the user is an admin level user
                if((subRef.data().ownerId === context.auth.uid || subRef.data().permissions[getAdminPermission()].indexOf(context.auth.uid) !== -1) && inviteRef.data().subscriptionId === subRef.id){
                    return admin.firestore().doc("invites/"+data.inviteId).delete();
                }else{
                    throw new Error("Permission denied.");
                }
            }).then(res => {
                return {
                    result: 'success'
                }
            }).catch(err => {
                throw new functions.https.HttpsError('internal', err.message);
            });
        }),

        acceptInvite: functions.https.onCall((data, context) => {
            let subscriptionId = null;
            let permissions = [];
            return getDoc("invites/"+data.inviteId).then(inviteRef => {
                if(inviteRef.data().email === context.auth.token.email){
                    if(context.auth.token.email_verified){
                        subscriptionId = inviteRef.data().subscriptionId;
                        permissions = inviteRef.data().permissions;
                        return admin.firestore().doc("invites/"+data.inviteId).delete(); 
                    }else{
                        throw new Error("Email is not verified.");
                    }
                }else{
                    throw new Error("Permission denied.");
                }
            }).then(() => {
                return addUserToSubscription(subscriptionId, context.auth.uid, permissions);
            }).then(() => {
                return {
                    result: 'success'
                }
            }).catch(err => {
                throw new functions.https.HttpsError('internal', err.message);
            });
        }),

        updateSubscriptionPaymentMethod: functions.https.onCall((data, context) => {
            const stripe = require('stripe')(config.stripe.secret_api_key);
            const paymentMethodId = data.paymentMethodId || null;
            const billingDetails = data.billingDetails || null;
            let stripeSubscriptionId = "";
            return getDoc("subscriptions/"+data.subscriptionId).then(subRef => {
                // check if the user is an admin level user
                if(subRef.data().ownerId === context.auth.uid){
                    stripeSubscriptionId = subRef.data().stripeSubscriptionId;
                    return getStripeCustomerId(
                        context.auth.uid,
                        context.auth.token.name,
                        context.auth.token.email,
                        paymentMethodId,
                        billingDetails
                    );
                }else{
                    throw new Error("Permission denied.");
                }
            }).then(() => {
                return stripe.subscriptions.update(
                    stripeSubscriptionId,
                    {
                        default_payment_method: data.paymentMethodId
                    }
                )
            }).then(() => {
                return {
                    result: 'success'
                }
            }).catch(err => {
                throw new functions.https.HttpsError('internal', err.message);
            });
        }),

        removePaymentMethod: functions.https.onCall((data, context) => {
            const stripe = require('stripe')(config.stripe.secret_api_key);
            const paymentMethodId = data.paymentMethodId || null;
            return admin.firestore().collection("subscriptions").where("paymentMethod", "==", paymentMethodId).get().then((snapshot) => {
                if(snapshot.empty){
                    return getDoc("users/"+context.auth.uid+"/paymentMethods/"+paymentMethodId);
                }else{
                    throw new Error("The payment method is active for at least one subscription");
                }
            }).then(() => {
                return stripe.paymentMethods.detach(paymentMethodId);
            }).then(() => {
                return admin.firestore().doc("users/"+context.auth.uid+"/paymentMethods/"+paymentMethodId).delete();
            }).catch(err => {
                throw new functions.https.HttpsError('internal', err.message);
            });
        }),

        cancelSubscription: functions.https.onCall((data, context) => {
            const stripe = require('stripe')(config.stripe.secret_api_key);
            return getDoc("subscriptions/"+data.subscriptionId).then(subRef => {
                // check if the user is an admin level user
                if(subRef.data().ownerId === context.auth.uid){
                    return stripe.subscriptions.del(subRef.data().stripeSubscriptionId);
                }else{
                    throw new Error("Permission denied.");
                }
            }).then(() => {
                return admin.firestore().doc("subscriptions/"+data.subscriptionId).set({
                    permissions: {}
                },{merge: true});
            }).then(() => {
                return {
                    result: 'success'
                }
            }).catch(err => {
                throw new functions.https.HttpsError('internal', err.message);
            });
        }),

        changeSubscriptionPlan: functions.https.onCall((data, context) => {
            const stripe = require('stripe')(config.stripe.secret_api_key);
            const paymentMethodId = data.paymentMethodId || null;
            const billingDetails = data.billingDetails || null;
            let selectedPlan = (config.plans.find(obj => obj.id === data.planId) || {});
            if(selectedPlan.legacy){
                throw new functions.https.HttpsError('internal', "The plan is not available.");
            }
            let stripeSubscriptionId = '';
            let addedItems = {};
            const deleteItemIds = [];
            return getDoc("subscriptions/"+data.subscriptionId).then(subRef => {
                // check if the user is an admin level user
                if(subRef.data().ownerId === context.auth.uid){
                    stripeSubscriptionId = subRef.data().stripeSubscriptionId;
                    for(const priceId in subRef.data().stripeItems){
                        deleteItemIds.push(subRef.data().stripeItems[priceId]);
                    }
                    return getStripeCustomerId(
                        context.auth.uid,
                        context.auth.token.name,
                        context.auth.token.email,
                        paymentMethodId,
                        billingDetails
                    );
                }else{
                    throw new Error("Permission denied.");
                }
            }).then(() => {
                // add new subscription items
                const items = [];
                for (const index in selectedPlan.priceIds){
                    items.push({
                        price: selectedPlan.priceIds[index]
                    });
                }
                const data = {
                    cancel_at_period_end: false,
                    proration_behavior: 'create_prorations',
                    items: items
                }
                if(selectedPlan.free === false){
                    data.default_payment_method = paymentMethodId;
                }
                return stripe.subscriptions.update(
                    stripeSubscriptionId,
                    data
                )
            }).then((subscription) => {
                // cancel all the existing subscription items
                const deleteItems = []
                for(const index in subscription.items.data){
                    const item = subscription.items.data[index];
                    if(deleteItemIds.indexOf(item.id) === -1){
                        // newly added item
                        if(item.price && item.price.id){
                            if(selectedPlan.priceIds.indexOf(item.price.id) === -1){
                                throw new Error("Invalid price ID in a subscription item.");
                            }else{
                                addedItems[item.price.id] = item.id;
                            }
                        }else{
                            throw new Error("Missing price ID in a subscription item.");
                        }
                    }else{
                        // existing item to be deleted
                        let setting = {
                            proration_behavior: "always_invoice"
                        }
                        if(item.price.recurring && item.price.recurring.usage_type === 'metered'){
                            setting["clear_usage"] = true;
                        }
                        deleteItems.push(stripe.subscriptionItems.del(item.id, setting));
                    }
                }
                if(deleteItems.length > 0){
                    return Promise.all(deleteItems);
                }else{
                    return {}
                }
            }).then(() => {
                return admin.firestore().doc("subscriptions/"+data.subscriptionId).update({
                    plan: selectedPlan.title, // title of the plan
                    planId: selectedPlan.id,
                    stripeItems: addedItems, // price ID in stripe
                    paymentCycle: selectedPlan.frequency,
                    price: selectedPlan.price,
                    currency: selectedPlan.currency,
                });
            }).then(() => {
                return {
                    result: 'success'
                }
            }).catch(err => {
                throw new functions.https.HttpsError('internal', err.message);
            });
        }),

        changeBillingDetails: functions.https.onCall((data, context) => {
            return getStripeCustomerId(
                context.auth.uid,
                context.auth.token.name,
                context.auth.token.email,
                null,
                data.billingDetails
            ).then(res => {
                return {
                    result: 'success'
                }
            }).catch(err => {
                throw new functions.https.HttpsError('internal', err.message);
            })
        }),

        stripeWebHook: functions.https.onRequest((req, res) => {
            const stripe = require('stripe')(config.stripe.secret_api_key);
            const endpointSecret = config.stripe.end_point_secret;
            const sig = req.headers['stripe-signature'];
            let event;
            try{
                let result = false;
                event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
                if(event.type.indexOf('invoice.') === 0){
                    updateInvoice(event.data.object).then(() => res.json({received: true})
                    ).catch(err => res.status(400).send(`Webhook Error: ${err.message}`));
                }
                if(event.type.indexOf('customer.subscription.') === 0){
                    updateSubscription(event.data.object).then(() => res.json({received: true})
                    ).catch(err => res.status(400).send(`Webhook Error: ${err.message}`));
                }
                if(event.type.indexOf('invoice.') !== 0 && event.type.indexOf('customer.subscription.') !== 0){
                    res.status(400).send(`Webhook Error: "No handler for the event type: ${event.type}"`);
                }
            }catch (err) {
                res.status(400).send(`Webhook Error: ${err.message}`);
            }
        })
    }
}