const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const paymentGatewayRepo = require('../dataAccessLayer').repositories.paymentGatewaysRepository;
const paymetGatewayModel = require('../helpers/models').paymentGateway;
const Validator = require('jsonschema').Validator;
const httpHandler = require('../helpers/httpHandler');
var v = new Validator();

const paymentGatewaysApi = express();
paymentGatewaysApi.use(cors()); // TODO: Configure CORS for allowed origin(s) only in PROD.
paymentGatewaysApi.use(bodyParser.json());

paymentGatewaysApi.post('/paymentGateways/addPaymentGateway', (req, res) => {
    let gateway = req.body;
    if (v.validate(gateway, paymetGatewayModel).valid) {
        return paymentGatewayRepo.create(gateway, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            } else {
                return httpHandler.handleSuccess(data, res);
            }
        })
    } else {
        return httpHandler.handleError("Bad Request", res, 400);
    }
});

module.exports = {
    paymentGatewaysApi
};