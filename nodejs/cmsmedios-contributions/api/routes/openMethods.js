const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { parse } = require('querystring');
const fs = require('fs');
const AES = require("crypto-js/aes");
const Crypto = require("crypto-js/core");
const contributionRepo = require('../dataAccessLayer/index').repositories.ContributionRepository;
const paymentGatewayRepo = require('../dataAccessLayer').repositories.paymentGatewaysRepository;
const subscriptionRepo = require('../dataAccessLayer/repository/index').SubscriptionRepository;
const userRepo = require('../dataAccessLayer/repository/index').UserRepository;
const paypalService = require('../paymentMethods').paypal;
const payuService = require('../paymentMethods').payu;
const mercadopagoService = require('../paymentMethods').mercadopago;
const serfinsaService = require('../paymentMethods').serfinsa;
const userRepository = require('../dataAccessLayer').repositories.UserRepository;
const filterModel = require('../helpers/models/index').contributionFilter;
const Validator = require('jsonschema').Validator;
const httpHandler = require('../helpers/httpHandler');
const subscriptionModel = require('../helpers/models/index').subscription;
const paymentEnum = require('../helpers').PaymentsEnum.paymentMethodsId;
const mercadoPagoRepository = require('../dataAccessLayer/repository/mercadoPagoRepository');
const serfinsaRepository = require('../dataAccessLayer/repository/serfinsaRepository');
const serfinsaHandler = require('../handlers/index').serfinsaHandler;
var v = new Validator();

const openMethodsApi = express();
openMethodsApi.use(cors()); // TODO: Configure CORS for allowed origin(s) only in PROD.
openMethodsApi.use(bodyParser.urlencoded({ extended: true }));
openMethodsApi.use(bodyParser.json());
openMethodsApi.use(bodyParser.raw());


openMethodsApi.post('/openmethods/contributions/getContributionsDefinition', (req, res) => {
    let filters = req.body;
    if (v.validate(filters, filterModel).valid) {
        return contributionRepo.getFiltered(filters, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            }
            return httpHandler.handleSuccess(data, res);
        })
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

openMethodsApi.get('/openmethods/contributions/:id/getContributionDefinition', (req, res) => {
    let id = req.params.id;
    return contributionRepo.getbyId(id, (err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        }
        return httpHandler.handleSuccess(data.Item, res)
    });
});

openMethodsApi.post('/openmethods/paymentGateways/getPaymentGateway', (req, res) => {
    let filters = req.body
    return paymentGatewayRepo.getAll((err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else {
            if (filters.id !== '' && filters.id !== undefined) {
                data = data.filter((gateway) => {
                    return gateway.id == filters.id;
                });
            }
            if (filters.type !== '' && filters.type !== undefined) {
                data = data.filter((gateway) => {
                    return gateway.type == filters.type;
                });
            }
            return httpHandler.handleSuccess(data, res);
        }
    });
});


openMethodsApi.post('/openmethods/payments/Paypal/:username/:subscriptionId/CreateSubscription', (req, res) => {
    let username = req.params.username;
    let subscriptionId = req.params.subscriptionId;
    subscriptionRepo.getbyId(subscriptionId, (err, subscription) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else if (subscription.Item === undefined) {
            return httpHandler.handleError("Subscription Id doesn't exist.", res, 400);
        } else {
            return userRepo.getByEmail(subscription.Item.username, (err, users) => {
                if (err) {
                    return httpHandler.handleError(err, res);
                } else if (users.Items && users.Items.length === 0) {
                    return httpHandler.handleError("User doesn't exist", res, 400);
                } else if (users.Items && users.Items[0].userEmail.toLowerCase() !== username.toLowerCase()) {
                    return httpHandler.handleError("Subscrtiption doesn't match with user associate with", res, 400);
                } else {
                    return paypalService.createSubscription(req.body)
                        .then((response) => {
                            if(response.id) {
                                subscription.Item.paypalId = response.id;
                                subscriptionRepo.updatePaymentId(subscription.Item, (err, data) => {
                                    if (err)
                                        return httpHandler.handleError(err, res);

                                    return httpHandler.handleSuccess(response, res);
                                });
                            }
                            else {
                                return httpHandler.handleError(response, res);
                            }
                        }).catch((err) => {
                            return httpHandler.handleError(err, res);
                        });
                }
            });
        }
    });
})


openMethodsApi.post('/openmethods/payments/payU/getWebCheckoutPayment', (req, res) => {
    const model = require('../helpers/models/index').payuWebCheckout;
    let paymentInfo = req.body;
    if (v.validate(paymentInfo, model).valid) {
        return payuService.getSinglePayment(paymentInfo)
            .then((plan) => {
                let body = plan;
                if (body.name == 'apiErrorResponse') {
                    return httpHandler.handleError(body, res);
                } else {
                    return httpHandler.handleSuccess(plan, res);
                }
            })
            .catch((err) => {
                return httpHandler.handleError(err)
            });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
})

openMethodsApi.post('/openmethods/payments/payU/:username/:subscriptionId/CreateSubscription', (req, res) => {
    let username = req.params.username;
    let subscriptionId = req.params.subscriptionId;
    let lang = "es";
    if(req.query.lang){
        lang = req.query.lang;
    }
    subscriptionRepo.getbyId(subscriptionId, (err, subscription) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else if (subscription.Item === undefined) {
            return httpHandler.handleError("Subscription Id doesn't exist.", res, 400);
        } else {
            return userRepo.getByEmail(subscription.Item.username, (err, users) => {
                if (err) {
                    return httpHandler.handleError(err, res);
                } else if (users.Items && users.Items.length === 0) {
                    return httpHandler.handleError("User doesn't exist", res, 400);
                } else if (users.Items && users.Items[0].userEmail.toLowerCase() !== username.toLowerCase()) {
                    return httpHandler.handleError("Subscrtiption doesn't match with user associate with", res, 400);
                } else {
                    return payuService.createRecursivePayment(req.body, lang)
                        .then((response) => {
                            //subscription.Item.payuId = response.data.children.find(x => x.name == 'id').value;
                            subscription.Item.payuId = response.data.id;
                            subscriptionRepo.updatePaymentId(subscription.Item, (err, data) => {
                                if (err)
                                    return httpHandler.handleError(err, res);
                                return httpHandler.handleSuccess(response.data, res);
                            });
                        }).catch((err) => {
                            return httpHandler.handleError(err.response.data, res);
                        });
                }
            });
        }
    });
});

openMethodsApi.post('/openmethods/payments/mercadopago/:username/:subscriptionId/CreateSubscription', (req, res) => {
    let username = req.params.username;
    let subscriptionId = req.params.subscriptionId;
    subscriptionRepo.getbyId(subscriptionId, (err, subscription) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else if (subscription.Item === undefined) {
            return httpHandler.handleError("Subscription Id doesn't exist.", res, 400);
        } else {
            return userRepo.getByEmail(subscription.Item.username, (err, users) => {
                if (err) {
                    return httpHandler.handleError(err, res);
                } else if (users.Items && users.Items.length === 0) {
                    return httpHandler.handleError("User doesn't exist", res, 400);
                } else if (users.Items && users.Items[0].userEmail.toLowerCase() !== username.toLowerCase()) {
                    return httpHandler.handleError("Subscrtiption doesn't match with user associate with", res, 400);
                } else {
                    contributionRepo.getbyId(subscription.Item.contributionId, (err, contribution) => {
                        if (err) 
                            return httpHandler.handleError(err, res);
                        for (let index = 0; index < contribution.Item.paymentMethods.length; index++) {
                            const element = contribution.Item.paymentMethods[index];
                            if(element.PaymentMethodId == subscription.Item.paymentMethodId) {
                                var paymentData = {
                                    token: req.body.token,
                                    description: req.body.description,
                                    installments: Number(req.body.installments),
                                    payment_method_id: req.body.payment_method_id,
                                    payer: {
                                      email: subscription.Item.username
                                    }
                                };
                                if(subscription.Item.paymentMethodId == paymentEnum.MercadoPagoWebChk.value){
                                    paymentData.transaction_amount = Number(contribution.Item.amount);
                                    return mercadopagoService.processPayment(paymentData)
                                        .then((response) => {
                                            subscription.Item.mercadopagoId.push(response.payment.response.id);
                                            subscription.Item.cardIdMercadopago = response.mpCard.id;
                                            subscription.Item.customerIdMercadopago = response.mpCustomer.id;
                                            subscriptionRepo.updatePaymentId(subscription.Item, (err, data) => {
                                                if (err)
                                                    return httpHandler.handleError(err, res);
                                                return httpHandler.handleSuccess(response, res);
                                            });
                                        }).catch((err) => {
                                            return httpHandler.handleError(err, res);
                                        });
                                }
                                if(subscription.Item.paymentMethodId == paymentEnum.MercadoPagoSub.value){
                                    mercadoPagoRepository.getPlanById(element.planId, (err, plan) => {
                                        if(err) return httpHandler.handleError(err, res);
                                        if(plan.Item) {
                                            paymentData.transaction_amount = Number(plan.Item.value);
                                            return mercadopagoService.processPayment(paymentData)
                                                .then((response) => {
                                                    subscription.Item.mercadopagoId.push(response.payment.response.id);
                                                    subscription.Item.cardIdMercadopago = response.mpCard.id;
                                                    subscription.Item.customerIdMercadopago = response.mpCustomer.id;
                                                    subscriptionRepo.updatePaymentId(subscription.Item, (err, data) => {
                                                        if (err)
                                                            return httpHandler.handleError(err, res);
                                                        return httpHandler.handleSuccess(response, res);
                                                    });
                                                }).catch((err) => {
                                                    return httpHandler.handleError(err, res);
                                                });
                                        }
                                        else {
                                            return httpHandler.handleError("Plan doesn't exist", res, 400);
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            });
        }
    });
    
});

openMethodsApi.post('/openmethods/payments/serfinsa/:username/:subscriptionId/CreateSubscription', (req, res) => {
    let username = req.params.username;
    let subscriptionId = req.params.subscriptionId;
    try { 
        let bytes = AES.decrypt(req.body.data, process.env.CRYPTO_SECRET_PHRASE);
        var decryptedData = JSON.parse(bytes.toString(Crypto.enc.Utf8));
    } catch(err) {
        return httpHandler.handleError("Bad request", res);
    }
    subscriptionRepo.getbyId(subscriptionId, (err, subscription) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else if (subscription.Item === undefined) {
            return httpHandler.handleError("Subscription Id doesn't exist.", res, 400);
        } else {
            return userRepo.getByEmail(subscription.Item.username, (err, users) => {
                if (err) {
                    return httpHandler.handleError(err, res);
                } else if (users.Items && users.Items.length === 0) {
                    return httpHandler.handleError("User doesn't exist", res, 400);
                } else if (users.Items && users.Items[0].userEmail.toLowerCase() !== username.toLowerCase()) {
                    return httpHandler.handleError("Subscrtiption doesn't match with user associate with", res, 400);
                } else {
                    contributionRepo.getbyId(subscription.Item.contributionId, (err, contribution) => {
                        if (err) 
                            return httpHandler.handleError(err, res);
                        for (let index = 0; index < contribution.Item.paymentMethods.length; index++) {
                            const element = contribution.Item.paymentMethods[index];
                            if(element.PaymentMethodId == subscription.Item.paymentMethodId) {
                                var paymentData = {
                                    info: decryptedData.info,
                                    infov: decryptedData.infov,
                                    infos: decryptedData.infos,
                                    email: subscription.Item.username,
                                    userId: users.Items[0].id
                                };
                                if(subscription.Item.paymentMethodId == paymentEnum.SerfinsaWebChk.value){
                                    paymentData.transaction_amount = Number(contribution.Item.amount);
                                    return serfinsaService.processPayment(paymentData)
                                        .then((response) => {
                                            subscription.Item.serfinsaId.push(response.transaction["Invoice"][0]);
                                            subscription.Item.cardIdSerfinsa = response.cardId;
                                            subscription.Item.customerIdSerfinsa = response.customerId;
                                            subscriptionRepo.updatePaymentId(subscription.Item, (err, data) => {
                                                if (err) return httpHandler.handleError(err, res);
                                                return serfinsaHandler.handleEvents({transaction: response, subscription: subscription}, (err, data) => {
                                                    if (err) return httpHandler.handleError(err, res);
                                                    return httpHandler.handleSuccess(response, res);
                                                });
                                            });
                                        }).catch((err) => {
                                            return httpHandler.handleError(err, res);
                                        });
                                }
                                if(subscription.Item.paymentMethodId == paymentEnum.SerfinsaSub.value){
                                    serfinsaRepository.getPlanById(element.planId, (err, plan) => {
                                        if(err) return httpHandler.handleError(err, res);
                                        if(plan.Item) {
                                            paymentData.transaction_amount = Number(plan.Item.value);
                                            return serfinsaService.processPayment(paymentData)
                                                .then((response) => {
                                                    subscription.Item.serfinsaId.push(response.transaction["Invoice"][0]);
                                                    subscription.Item.cardIdSerfinsa = response.cardId;
                                                    subscription.Item.customerIdSerfinsa = response.customerId;
                                                    subscriptionRepo.updatePaymentId(subscription.Item, (err, data) => {
                                                        if (err) return httpHandler.handleError(err, res);
                                                        return serfinsaHandler.handleEvents({transaction: response, subscription: subscription}, (err, data) => {
                                                            if (err) return httpHandler.handleError(err, res);
                                                            return httpHandler.handleSuccess(response, res);
                                                        });
                                                    });
                                                }).catch((err) => {
                                                    return httpHandler.handleError(err, res);
                                                });
                                        }
                                        else {
                                            return httpHandler.handleError("Plan doesn't exist", res, 400);
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            });
        }
    });
    
});

openMethodsApi.post('/openmethods/subscriptions/addSubscription', (req, res) => {
    let subscription = req.body;
    if (v.validate(subscription, subscriptionModel).valid) {
        //validate username
        return userRepository.getByEmail(subscription.username, (err, data) => {
            if (err)
                return httpHandler.handleError(err, res);

            if (Object.keys(data.Items).length > 0) {

                return contributionRepo.getbyId(subscription.contributionId, (err, data) => {
                    if (err) {
                        return httpHandler.handleError(err, res);
                    }

                    if (data.Item != undefined) {
                        subscription.type = data.Item.type;
                        return subscriptionRepo.create(subscription, (err, data) => {
                            if (err) {
                                return httpHandler.handleError(err, res);
                            } else {
                                httpHandler.handleSuccess(data, res);
                            }
                        });
                    } else {
                        httpHandler.handleError("Not contribution found", res, 400);
                    }
                });
            } else {
                httpHandler.handleError("Not user found", res, 400);
            }
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

openMethodsApi.post('/openmethods/test-serfinsa-delete-customer', (req, res) => {
    serfinsaService.deleteCustomerSerfinsa({
        key: req.body.key
    }).then(data => {
        return httpHandler.handleSuccess(data, res);
    }).catch(err => {
        console.log(err);
        return httpHandler.handleError(err, res, 400);
    })
});

module.exports = {
    openMethodsApi
}