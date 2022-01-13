const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var payuService = require('../paymentMethods').payu;
var paypalService = require('../paymentMethods').paypal;
const userRepo = require('../dataAccessLayer/repository/index').UserRepository;
const paymentRepo = require('../dataAccessLayer/repository/').PaymentRepository;
const paypalHandler = require('../handlers/index').paypalHandler;
const payuHandler = require('../handlers/index').payuHandler;
const mercadopagoHandler = require('../handlers/index').mercadopagoHandler;
const httpHandler = require('../helpers/httpHandler');

const Validator = require('jsonschema').Validator;
var validateSchema = new Validator();

const webhookApi = express();
webhookApi.use(cors()); // TODO: Configure CORS for allowed origin(s) only in PROD.
//webhookApi.use(bodyParser.json());
webhookApi.use(bodyParser.urlencoded({ extended: true }));
webhookApi.use(bodyParser.json());
webhookApi.use(bodyParser.raw());

webhookApi.post('/webhooks/paypal', (req, res) => {
    let body = req.body;
    return paypalHandler.handleEvents(body, (err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        }
        return httpHandler.handleSuccess(data, res);
    });
})
webhookApi.post('/webhooks/payU', (req, res) => {
    let body = req.body;
    return payuHandler.handleEvents(body, (err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        }
        return httpHandler.handleSuccess(data, res);
    });
})
webhookApi.post('/webhooks/mercadopago', (req, res) => {
    let body = req.body;
    if(body.action === "test.created"){
        return httpHandler.handleSuccess(null, res);
    }
    else {
        return mercadopagoHandler.handleEvents(body, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            }
            return httpHandler.handleSuccess(data, res);
        });
    }
})

module.exports = {
    webhookApi
}