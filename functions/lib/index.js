const functions = require('firebase-functions');

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
    const getStripeCustomerId = (userId, name, email, paymentMethodId) => {
        const stripe = require('stripe')(config.secret_api_key);
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
            for(var i=0; i<permissions.length; i++){
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

    return {
        /**
         * create a subscription
         */
        createSubscription: functions.https.onCall((data, context) => {
            const stripe = require('stripe')(config.secret_api_key);
            const paymentMethodId = data.paymentMethodId || null;
            let selectedPlan = (config.plans.find(obj => obj.priceId === data.priceId) || {});
            return getStripeCustomerId(
                context.auth.uid,
                context.auth.token.name,
                context.auth.token.email,
                paymentMethodId
            ).then(stripeCustomerId => {
                // create subscription
                return stripe.subscriptions.create({
                    customer: stripeCustomerId,
                    //default_tax_rates: taxRates,
                    default_payment_method: paymentMethodId,
                    items: [
                        {price: selectedPlan.priceId}
                    ]
                });
            }).then(subscription => {
                // init permissions
                const permissions = {}
                for (p in config.permissions){
                    if(permissions[p].default || permissions[p].admin){
                        // grant all default and admin permissions to the current user
                        permissions[p] = [];
                        permissions[p].push(context.auth.uid);
                    }
                }
                const sub = {
                    plan: selectedPlan.title, // title of the plan
                    stripePriceId: selectedPlan.priceId, // price ID in stripe
                    paymentCycle: selectedPlan.frequency,
                    price: selectedPlan.price,
                    currency: selectedPlan.currency,
                    stripeSubscriptionId: subscription.id,
                    subscriptionStatus: subscription.status,
                    subscriptionCreated: subscription.created,
                    subscriptionCurrentPeriodStart: subscription.current_period_start,
                    subscriptionCurrentPeriodEnd: subscription.current_period_end,
                    subscriptionEnded: subscription.ended || 0,
                    ownerId: context.auth.uid,
                    permissions: permissions
                    //billingCountry: data.billing.country,
                    //billingState: data.billing.state                    
                }
                return admin.firestore().collection('subscriptions').add(sub);
            }).then(sub => {
                return {
                    subacriptionId: sub.id
                }
            }).catch(error => {
                throw new functions.https.HttpsError('internal', error.message);
            });
        })
    }
}
