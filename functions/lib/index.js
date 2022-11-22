const functions = require('firebase-functions');

module.exports = function(config){
    return {
        createSubscription: functions.https.onCall((data, context) => {
            const stripe = require('stripe')(config.secret_api_key);
            const priceId = data.priceId;
            let selectedPlan = (config.plans.find(obj => obj.priceId === priceId) || {});
            console.log(selectedPlan);
        })
    }
}
