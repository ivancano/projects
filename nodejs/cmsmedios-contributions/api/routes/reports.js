const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const reportsRepository = require('../dataAccessLayer').repositories.ReportsRepository;
const httpHandler = require('../helpers/httpHandler');
const Validator = require('jsonschema').Validator;
var validateSchema = new Validator();

const reportsApi = express();
reportsApi.use(cors()); // TODO: Configure CORS for allowed origin(s) only in PROD.
reportsApi.use(bodyParser.json());

reportsApi.get('/reports/UsersByPackage', (req, res) => {
    var model = require('../helpers/models').reportsUsersByPackage;
    let filters = req.query;
    if (validateSchema.validate(filters, model).valid) {
        return reportsRepository.UsersByPackage(filters.dateFrom, filters.dateTo, filters.itemsxpage, filters.lastid, filters.contributionId, filters.paymentMethodId, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            } else {
                return httpHandler.handleSuccess(data, res);
            }
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

reportsApi.get('/reports/UsersUnsubscribedByPackage', (req, res) => {
    var model = require('../helpers/models').reportsUserUnsuscribed;
    let filters = req.query;
    if (validateSchema.validate(filters, model).valid) {
        return reportsRepository.UsersUnsubscribedByPackage(filters.dateFrom, filters.dateTo, filters.itemsxpage, filters.lastid, filters.contributionId, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            } else {
                return httpHandler.handleSuccess(data, res);
            }
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

reportsApi.get('/reports/PaymentsByPackage', (req, res) => {
    var model = require('../helpers/models').reportsPaymentsByPackage;
    let filters = req.query;
    if (validateSchema.validate(filters, model).valid) {
        return reportsRepository.payments(filters, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            } else {
                return httpHandler.handleSuccess(data, res);
            }
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

reportsApi.get('/reports/Donations', (req, res) => {
    var model = require('../helpers/models').reportsDonation;
    let filters = req.query;
    if (validateSchema.validate(filters, model).valid) {
        return reportsRepository.payments(filters, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            } else {
                return httpHandler.handleSuccess(data, res);
            }
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

reportsApi.get('/reports/PaymentsMethods', (req, res) => {
    return reportsRepository.PaymentsMethods((err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else {
            return httpHandler.handleSuccess(data, res);
        }
    });
});

module.exports = {
    reportsApi
};