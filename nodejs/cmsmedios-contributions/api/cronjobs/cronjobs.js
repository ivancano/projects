const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { parse } = require('querystring');
const subscriptionRepository = require('../dataAccessLayer').repositories.SubscriptionRepository;
const httpHandler = require('../helpers/httpHandler');
const mercadopagoService = require('../paymentMethods').mercadopago;
const serfinsaService = require('../paymentMethods').serfinsa;


const cronjobsApi = () => {
    subscriptionRepository.getSubscriptionsExpired("mercadopago", async (err, subscriptions) => {
        if (err) {
            throw new Error("Error getting expired subscriptions");
        }
        var result = [];
        var errors = [];
        for (let index = 0; index < subscriptions.length; index++) {
            const s = subscriptions[index];
            const resServiceMercadoPago = await mercadopagoService.paySubscription(s.mercadopagoId[0], s.customerIdMercadopago, s);
            if(resServiceMercadoPago.error) {
                errors.push(s);
            }
            else {
                var paymentsMercadoPago = s.mercadopagoId;
                paymentsMercadoPago.push(resServiceMercadoPago.payment.response.id);
                await subscriptionRepository.appendPaymentMercadoPago(s, paymentsMercadoPago);
                result.push(resServiceMercadoPago);
            }
            return JSON.stringify({success: result, error: errors});
        }

        subscriptionRepository.getSubscriptionsExpired("serfinsa", async (err, subscriptions) => {
            if (err) {
                throw new Error("Error getting expired subscriptions");
            }
            for (let index = 0; index < subscriptions.length; index++) {
                const s = subscriptions[index];
                const resServiceSerfinsa = await serfinsaService.paySubscription(s.serfinsaId[0], s.customerIdSerfinsa, s);
                if(resServiceSerfinsa.error) {
                    errors.push(s);
                }
                else {
                    var paymentsSerfinsa = s.serfinsaId;
                    paymentsSerfinsa.push(resServiceSerfinsa["Invoice"][0]);
                    await subscriptionRepository.appendPaymentSerfinsa(s, paymentsSerfinsa);
                    result.push(resServiceSerfinsa);
                }
            }
            return JSON.stringify({success: result, error: errors});
        });

    });
}

module.exports = {
    cronjobsApi
};