const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const subscriptionRepository = require('../dataAccessLayer').repositories.SubscriptionRepository
const subscriptionFindModel = require('../helpers/models/index').subscriptionFind;
const Validator = require('jsonschema').Validator;
const httpHandler = require('../helpers/httpHandler');
var v = new Validator();
const mercadopagoService = require('../paymentMethods').mercadopago;
const serfinsaService = require('../paymentMethods').serfinsa;
const payuService = require('../paymentMethods').payu;

const subscriptionsApi = express();
subscriptionsApi.use(cors()); // TODO: Configure CORS for allowed origin(s) only in PROD.
subscriptionsApi.use(bodyParser.json());

subscriptionsApi.delete('/subscriptions/:id/removeSubscription', (req, res) => {
    let subscriptionId = req.params.id;
    let lang = "es";
    if(req.query.lang){
        lang = req.query.lang;
    }
    return subscriptionRepository.getbyId(subscriptionId, (err, data) => {
        if (JSON.stringify(data) == JSON.stringify({}))
            return httpHandler.handleError("subscription not found", res, 400);

        if(data.Item.payuId !== "" && data.Item.payuId !== null){
            payuService.deleteSubscription(data.Item.payuId, lang).then((result) => {
                return subscriptionRepository.deleteSubscription(subscriptionId, (err, data) => {
                    if (err) {
                        return httpHandler.handleError(err, res);
                    } else {
                        httpHandler.handleSuccess(data, res);
                    }
                });
            }).catch(err => {
                return httpHandler.handleError(err.response.data, res);
            });
        }
        else {
            return subscriptionRepository.deleteSubscription(subscriptionId, (err, data) => {
                if (err) {
                    return httpHandler.handleError(err, res);
                } else {
                    httpHandler.handleSuccess(data, res);
                }
            });
        }
    })

});

subscriptionsApi.post('/subscriptions/getSubscriptions', (req, res) => {
    let filters = req.body;
    if (v.validate(filters, subscriptionFindModel).valid) {
        return subscriptionRepository.getFiltered(filters, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            }
            return httpHandler.handleSuccess(data, res);
        })
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

subscriptionsApi.post('/subscriptions/expired', (req, res) => {
    subscriptionRepository.getSubscriptionsExpired("mercadopago", async (err, subscriptions) => {
        if (err) {
            return httpHandler.handleError(err, res);
        }
        var result = [];
        for (let index = 0; index < subscriptions.length; index++) {
            const s = subscriptions[index];
            const resServiceMercadoPago = await mercadopagoService.paySubscription(s.mercadopagoId[0], s.customerIdMercadopago, s);
            var paymentsMercadoPago = s.mercadopagoId;
            paymentsMercadoPago.push(resServiceMercadoPago.payment.response.id);
            await subscriptionRepository.appendPaymentMercadoPago(s, paymentsMercadoPago);
            result.push(resServiceMercadoPago);
        }

        subscriptionRepository.getSubscriptionsExpired("serfinsa", async (err, subscriptions) => {
            if (err) {
                return httpHandler.handleError(err, res);
            }
            for (let index = 0; index < subscriptions.length; index++) {
                const s = subscriptions[index];
                const resServiceSerfinsa = await serfinsaService.paySubscription(s.serfinsaId[0], s.customerIdSerfinsa, s);
                var paymentsSerfinsa = s.serfinsaId;
                paymentsSerfinsa.push(resServiceSerfinsa["Invoice"][0]);
                await subscriptionRepository.appendPaymentSerfinsa(s, paymentsSerfinsa);
                result.push(resServiceSerfinsa);
            }
            return httpHandler.handleSuccess(result, res);
        });

    });
});

module.exports = {
    subscriptionsApi
};