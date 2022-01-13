const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var payuService = require('../paymentMethods').payu;
var paypalService = require('../paymentMethods').paypal;
const userRepo = require('../dataAccessLayer/repository/index').UserRepository;
const subscriptionRepo = require('../dataAccessLayer/repository/index').SubscriptionRepository;
const mercadoPagoRepo = require('../dataAccessLayer/repository/index').MercadoPagoRepository;
const paymentRepo = require('../dataAccessLayer/repository/').PaymentRepository;
const paypalHandler = require('../handlers/index').paypalHandler;
const payuHandler = require('../handlers/index').payuHandler;
const httpHandler = require('../helpers/httpHandler');
const mercadoPagoRepository = require('../dataAccessLayer/repository/mercadoPagoRepository');
const serfinsaRepository = require('../dataAccessLayer/repository/serfinsaRepository');

const Validator = require('jsonschema').Validator;
var validateSchema = new Validator();

const paymentsApi = express();
paymentsApi.use(cors()); // TODO: Configure CORS for allowed origin(s) only in PROD.
paymentsApi.use(bodyParser.json());


paymentsApi.post('/payments/getPayments', (req, res) => {
        var model = require('../helpers/models').paymentFilter;
        let filters = req.body;
        if (validateSchema.validate(filters, model).valid) {
            paymentRepo.getFiltered(filters, (err, data) => {
                if (err) {
                    return httpHandler.handleError(err, res);
                }
                return httpHandler.handleSuccess(data, res);
            });
        } else {
            httpHandler.handleError("Bad Request", res, 400);
        }

    })
    //******************** PAYPAL ***********************/

paymentsApi.post('/payments/Paypal/CreateProduct', (req, res) => {
    return paypalService.createProduct(req.body)
        .then((response) => {
            return httpHandler.handleSuccess(response, res);
        }).catch((err) => {
            return httpHandler.handleError(err, res);
        });
})
paymentsApi.post('/payments/Paypal/CreatePlan', (req, res) => {
    return paypalService.createPlan(req.body)
        .then((response) => {
            return httpHandler.handleSuccess(response, res);
        }).catch((err) => {
            return httpHandler.handleError(err, res);
        });
})

//*********************** PAYU ******************************/

paymentsApi.get('/payments/payU/:planName/getPlanByName', (req, res) => {
    let planName = req.params.planName;
    return payuService.getPlanByName(planName)
        .then((plan) => {
            return httpHandler.handleSuccess(plan.data, res);
        })
        .catch((err) => {
            return httpHandler.handleError(err.response.data, res);
        });
});

paymentsApi.post('/payments/payU/createPlan', (req, res) => {
    const model = require('../helpers/models/index').payuCreatePlan;
    let payu = req.body;
    if (validateSchema.validate(payu, model).valid) {
        return payuService.createPlan(payu)
            .then((plan) => {
                return httpHandler.handleSuccess(plan.data, res);
            })
            .catch((err) => {
                return httpHandler.handleError(err.response.data, res);
            });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

paymentsApi.post('/payments/mercadopago/createPlan', (req, res) => {
    const model = require('../helpers/models/index').mercadoPagoCreatePlan;
    let planModel = req.body;
    if (validateSchema.validate(planModel, model).valid) {
        return mercadoPagoRepository.createPlan(planModel, (err, plan) => {
            if(err) return httpHandler.handleError(err, res);
            return httpHandler.handleSuccess(plan, res);
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

paymentsApi.post('/payments/serfinsa/createPlan', (req, res) => {
    const model = require('../helpers/models/index').serfinsaCreatePlan;
    let planModel = req.body;
    if (validateSchema.validate(planModel, model).valid) {
        return serfinsaRepository.createPlan(planModel, (err, plan) => {
            if(err) return httpHandler.handleError(err, res);
            return httpHandler.handleSuccess(plan, res);
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

module.exports = {
    paymentsApi
}