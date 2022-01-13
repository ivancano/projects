const payu = require('payu');
const crypto = require('crypto');
const needle = require('needle');
const axios = require('axios');

let getSinglePayment = (paymentInfo) => {
    return new Promise((resolve, reject) => {
        let paymentObj = {
            merchantId: process.env.PAYU_MERCHANT_ID,
            referenceCode: paymentInfo.referenceCode,
            description: paymentInfo.description,
            amount: paymentInfo.amount,
            tax: paymentInfo.tax,
            signature: createSignature(paymentInfo.referenceCode, paymentInfo.amount, paymentInfo.currency),
            accountId: process.env.PAYU_ACCOUNT_ID,
            currency: paymentInfo.currency,
            buyerFullName: "",
            buyerEmail: "",
            shippingAddress: "",
            shippingCity: "",
            shippingCountry: "",
            telephone: ""
        }
        resolve(paymentObj);
    });
}

let createSignature = (referenceCode, amount, currency) => {
    let apiKey = process.env.PAYU_API_KEY;
    let merchantId = process.env.PAYU_MERCHANT_ID;
    let signature = crypto.createHash('sha256').update(apiKey + "~" + merchantId + "~" + referenceCode + "~" + amount + "~" + currency).digest('hex');
    return signature;
}


let createRecursivePayment = (payment, lang) => {
    let body = payment;
    let url = process.env.PAYU_API_URL;
    let Auth = "Basic " + Buffer.from(`${process.env.PAYU_API_LOGIN}:${process.env.PAYU_API_KEY}`).toString('base64');
    let options = { headers: { "Authorization": Auth, "Content-Type": "application/json", "Accept-Language": lang } };
    return axios({
        method: 'POST',
        url: url + '/rest/v4.9/subscriptions',
        data: body,
        headers: options.headers
    });
    /*return needle('post', url + '/rest/v4.9/subscriptions', body, options).then((response) => {
        return response.body;
    });*/
}

let createPlan = (planPayU) => {
    let planModel = {
        accountId: process.env.PAYU_ACCOUNT_ID,
        planCode: planPayU.planCode,
        description: planPayU.description,
        interval: planPayU.interval,
        intervalCount: planPayU.intervalcount,
        maxPaymentsAllowed: planPayU.maxPaymentsAllowed,
        paymentAttemptsDelay: planPayU.paymentAttemptsDelay,
        additionalValues: [{
            name: "PLAN_VALUE",
            value: planPayU.value,
            currency: planPayU.currency
        }]
    };
    let url = process.env.PAYU_API_URL;
    let Auth = "Basic " + Buffer.from(`${process.env.PAYU_API_LOGIN}:${process.env.PAYU_API_KEY}`).toString('base64');
    let options = { headers: { "Authorization": Auth, "Content-Type": "application/json" } };
    return axios({
        method: 'POST',
        url: url + '/rest/v4.9/plans',
        data: planModel,
        headers: options.headers
    });
}

let getPlanByName = (planName) => {
    let url = process.env.PAYU_API_URL;
    let Auth = "Basic " + Buffer.from(`${process.env.PAYU_API_LOGIN}:${process.env.PAYU_API_KEY}`).toString('base64');
    let options = { headers: { "Authorization": Auth, "Content-Type": "application/json" } };
    return axios({
        method: 'GET',
        url: url + '/rest/v4.9/plans/' + planName,
        headers: options.headers
    });
    //return needle('get', url + '/rest/v4.9/plans/' + planName, options);
}

let deleteSubscription = (payuSubscriptionId, lang) => {
    let url = process.env.PAYU_API_URL;
    let Auth = "Basic " + Buffer.from(`${process.env.PAYU_API_LOGIN}:${process.env.PAYU_API_KEY}`).toString('base64');
    let options = { headers: { "Authorization": Auth, "Content-Type": "application/json", "Accept-Language": lang } };
    return axios({
        method: 'DELETE',
        url: url + '/rest/v4.9/subscriptions/' + payuSubscriptionId,
        headers: options.headers
    });
    /*return needle('post', url + '/rest/v4.9/subscriptions', body, options).then((response) => {
        return response.body;
    });*/
}

module.exports = {
    getPlanByName,
    getSinglePayment,
    createPlan,
    createRecursivePayment,
    deleteSubscription
}