const mercadopago = require('mercadopago');
const crypto = require('crypto');
const needle = require('needle');
const contributionRepo = require('../dataAccessLayer/index').repositories.ContributionRepository;
const paymentEnum = require('../helpers').PaymentsEnum.paymentMethodsId;
const mercadoPagoRepository = require('../dataAccessLayer/repository/mercadoPagoRepository');
const mercadoPagoCustomersRepository = require('../dataAccessLayer/repository/mercadoPagoCustomersRepository');
const mercadoPagoCardsRepository = require('../dataAccessLayer/repository/mercadoPagoCardsRepository');
mercadopago.configure({
    sandbox: true,
    access_token: process.env.MP_ACCESS_TOKEN
});

let processPayment = (paymentData) => {
    return new Promise((resolve, reject) => {
        getCustomer({ email: paymentData.payer.email }).then(customerResponse => {
            // Cliente existente
            if (customerResponse.response.results.length > 0) {
                const customer = customerResponse.response.results[0];
                makePayment(paymentData).then(payment => {
                    console.log(payment);
                    const card = {
                        token: paymentData.token,
                        customer_id: customer.id
                    };
                    createCard(card).then((resCard) => {
                        const cardResponse = (resCard.response) ? resCard.response : resCard;
                        mercadoPagoCardsRepository.createOrGet({cardId: cardResponse.id}, (err, resMPCard) => {
                            if(err) return reject(err);
                            const mpCustomers = {
                                customer_id: customer.id,
                                card: resMPCard.id
                            }
                            mercadoPagoCustomersRepository.createOrUpdate(mpCustomers, (err, resMPCustomer) => {
                                if(err) return reject(err);
                                return resolve({payment: payment, customer: customer, mpCustomer: resMPCustomer, mpCard: resMPCard});
                            });
                        })
                    }).catch(err => {
                        console.log(err);
                        return reject(err);
                    })
                }).catch(err => {
                    console.log(err);
                    return reject(err);
                });
            }
            else {
                // Cliente no existe. Procesar pago.
                makePayment(paymentData).then(payment => {
                    console.log(payment);
                    const customerData = { email: paymentData.payer.email }
                    createCustomer(customerData).then(newCustomer => {
                        const card = {
                            token: paymentData.token,
                            customer_id: (newCustomer.response) ? newCustomer.response.id : newCustomer.id
                        };
                        createCard(card).then((resCard) => {
                            const cardResponse = (resCard.response) ? resCard.response : resCard;
                            mercadoPagoCardsRepository.createOrGet({cardId: cardResponse.id}, (err, resMPCard) => {
                                if(err) return reject(err);
                                const mpCustomers = {
                                    customer_id: (newCustomer.response) ? newCustomer.response.id : newCustomer.id,
                                    card: resMPCard.id
                                }
                                mercadoPagoCustomersRepository.createOrUpdate(mpCustomers, (err, resMPCustomer) => {
                                    if(err) return reject(err);
                                    return resolve({payment: payment, customer: newCustomer, mpCustomer: resMPCustomer, mpCard: resMPCard});
                                });
                            })
                        }).catch(err => {
                            console.log(err);
                            return reject(err);
                        })
                    }).catch(err => {
                        console.log(err);
                        return reject(err);
                    });
                }).catch(err => {
                    console.log(err);
                    return reject(err);
                });
            }
        }).catch(err => {
            console.log(err);
            return reject(err);
        });
    });
    
};

let paySubscription = (mercadopagoId, customerMP, subscription) => {
    return new Promise((resolve, reject) => {
        mercadopago.payment.get(mercadopagoId).then(payment => {
            getCustomer({ id: customerMP.customerId }).then(customerResponse => {
                if (customerResponse.response.results.length > 0) {
                    const customer = customerResponse.response.results[0];
                    if (customer.cards.length === 0) {
                        resolve({error: true, msg: "Customer does not have a card"});
                    }
                    else {
                        mercadoPagoCardsRepository.getById(subscription.cardIdMercadopago).then((cardMP) => {
                            getCardToken(cardMP.Item.cardId).then(token => {
                                paymentData = {};
                                paymentData.token = token.response.id;
                                paymentData.payer = {
                                    id: customer.id
                                };
                                paymentData.installments = 1;
                                contributionRepo.getbyId(subscription.contributionId, (err, contribution) => {
                                    if (err) return resolve({error: true, msg: err});
                                    for (let index = 0; index < contribution.Item.paymentMethods.length; index++) {
                                        const element = contribution.Item.paymentMethods[index];
                                        if(element.PaymentMethodId == subscription.paymentMethodId) {
                                            mercadoPagoRepository.getPlanById(element.planId, (err, plan) => {
                                                if(err) return resolve({error: true, msg: err});
                                                if(plan.Item) {
                                                    paymentData.transaction_amount = Number(plan.Item.value);
                                                    makePayment(paymentData).then(payment => {
                                                        console.log(payment);
                                                        return resolve({payment: payment, customer: customer});
                                                    }).catch(err => {
                                                        console.log(err);
                                                        return resolve({error: true, msg: err});
                                                    });
                                                }
                                                else {
                                                    return resolve({error: true, msg: "Plan doesn't exist"});
                                                }
                                            });
                                        }
                                    }
                                });
                            }).catch(err => {
                                console.log(err);
                                return resolve({error: true, msg: err});
                            });
                        }).catch(err => {
                            console.log(err);
                            return resolve({error: true, msg: err});
                        });
                    }
                }
                else {
                    resolve({error: true, msg: "Customer not found"});
                }
            }).catch(err => {
                console.log(err);
                return resolve({error: true, msg: err});
            });
        }).catch(err => {
            console.log(err);
            return resolve({error: true, msg: err});
        });
    });
}

let makePayment = (paymentData) => {
    return mercadopago.payment.save(paymentData);
}

let getCustomer = (filter) => {
    return mercadopago.customers.search({ qs: filter });
}

let createCustomer = (customerData) => {
    return mercadopago.customers.create(customerData);
}

let createCard = (cardData) => {
    return mercadopago.card.create(cardData);
}

let getCardToken = (cardId) => {
    return mercadopago.card_token.save({card_id: cardId});
}

module.exports = {
    processPayment,
    paySubscription
}