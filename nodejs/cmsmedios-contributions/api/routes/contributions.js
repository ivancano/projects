const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const contributionRepo = require('../dataAccessLayer/index').repositories.ContributionRepository;
const requestModel = require('../helpers/models/index').contributionRequest;
const filterModel = require('../helpers/models/index').contributionFilter;
const Validator = require('jsonschema').Validator;
const httpHandler = require('../helpers/httpHandler');

var v = new Validator();

const contributionsApi = express();
contributionsApi.use(cors()); // TODO: Configure CORS for allowed origin(s) only in PROD.
contributionsApi.use(bodyParser.json());

contributionsApi.post('/contributions/createContributionDefinition', (req, res) => {
    let contribution = req.body;
    if (v.validate(contribution, requestModel).valid) {
        return contributionRepo.create(contribution, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            }
            return httpHandler.handleSuccess(data, res)
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

contributionsApi.put('/contributions/:id/updateContributionDefinition', (req, res) => {
    let id = req.params.id;
    let contributionbody = req.body;
    if (v.validate(contributionbody, requestModel).valid) {
        contributionbody.id = id;
        return contributionRepo.update(contributionbody, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            }
            return httpHandler.handleSuccess(data, res)
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

contributionsApi.delete('/contributions/:id/deleteContributionDefinition', (req, res) => {
    let id = req.params.id;
    return contributionRepo.deleteContribution(id, (err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        }
        return httpHandler.handleSuccess(data, res)
    });
});

module.exports = {
    contributionsApi
}