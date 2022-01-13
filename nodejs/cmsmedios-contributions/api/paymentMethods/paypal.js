const needle = require('needle');
const models = require('../helpers/models')

let getPaypalToken = () => {
    var dataString = 'grant_type=client_credentials';
    let url = process.env.PAYPAL_API_URL + '/v1/oauth2/token';
    let credentials = `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`;
    let Auth = "Basic " + Buffer.from(credentials).toString('base64');
    let options = { headers: { "Authorization": Auth, "Content-Type": "application/json" } };
    return needle('post', url, dataString, options).then((res) => {
        return res.body.access_token;
    });
};

let createPlan = (plan) => {
    return getPaypalToken().then((token) => {
        let url = process.env.PAYPAL_API_URL;
        let Auth = "Bearer " + token;
        let body = plan;
        let options = { headers: { "Authorization": Auth, "Content-Type": "application/json" } };
        return needle('post', url + '/v1/billing/plans', body, options).then((res) => {
            return res.body;
        });
    });
};

let createProduct = (product) => {
    return getPaypalToken().then((token) => {
        let url = process.env.PAYPAL_API_URL;
        let Auth = "Bearer " + token;
        let body = product;
        let options = { headers: { "Authorization": Auth, "Content-Type": "application/json" } };
        return needle('post', url + '/v1/catalogs/products', body, options).then((res) => {
            return res.body;
        });
    });
};

let createSubscription = (product) => {
    return getPaypalToken().then((token) => {
        let url = process.env.PAYPAL_API_URL;
        let Auth = "Bearer " + token;
        let body = product;
        let options = { headers: { "Authorization": Auth, "Content-Type": "application/json" } };
        return needle('post', url + '/v1/billing/subscriptions', body, options).then((res) => {
            return res.body;
        });
    });
};

let getSubscription = (id) => {
    return getPaypalToken().then((token) => {
        let url = process.env.PAYPAL_API_URL;
        let Auth = "Bearer " + token;
        let options = { headers: { "Authorization": Auth, "Content-Type": "application/json" } };
        return needle('get', url + '/v1/billing/subscriptions/' + id, options).then((res) => {
            return res.body;
        });
    });
};

module.exports = {
    createPlan,
    createProduct,
    createSubscription,
    getPaypalToken,
    getSubscription
};