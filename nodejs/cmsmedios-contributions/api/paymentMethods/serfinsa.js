const soapRequest = require('easy-soap-request');
var parseString = require('xml2js').parseString;
const contributionRepo = require('../dataAccessLayer/index').repositories.ContributionRepository;
const paymentEnum = require('../helpers').PaymentsEnum.paymentMethodsId;
const serfinsaRepository = require('../dataAccessLayer/repository/serfinsaRepository');
const serfinsaCustomersRepository = require('../dataAccessLayer/repository/serfinsaCustomersRepository');
const serfinsaCardsRepository = require('../dataAccessLayer/repository/serfinsaCardsRepository');
const serfinsaHandler = require('../handlers/index').serfinsaHandler;

let processPayment = (paymentData) => {
    return new Promise((resolve, reject) => {
        serfinsaCustomersRepository.getCustomer(paymentData.email, (err, customer) => {
            console.log("Customer exists");
            if(err) return reject(err);
            if(customer.length > 0) {
                serfinsaCardsRepository.getFiltered({customerId: customer[0].id, lastDigits: paymentData.info.substr(paymentData.info.length - 4)}, (err, card) => {
                    if(err) return reject(err);
                    if(card.length === 0){
                        updateCustomer(customer[0].id, paymentData).then(serfinsaCustomer => {
                            makePayment(serfinsaCustomer.serfinsaCustomer, paymentData).then(transaction => {
                                return resolve({transaction: transaction, cardId: serfinsaCustomer.card.id, customerId: customer[0].id});
                            }).catch(err => {
                                return reject(err);
                            });
                        }).catch(err => {
                            return reject(err);
                        });
                    }
                    else {
                        generateTransactionSerfinsa({key: card[0].token, amount: paymentData.transaction_amount}).then(transaction => {
                            return resolve({transaction: transaction, cardId: card[0].id, customerId: customer[0].id});
                        }).catch(err => {
                            return reject(err);
                        });
                    }
                })
            }
            else {
                console.log("Customer doesn't exist");
                createCustomer(paymentData).then(serfinsaCustomer => {
                    makePayment(serfinsaCustomer.serfinsaCustomer, paymentData).then(transaction => {
                        return resolve({transaction: transaction, cardId: serfinsaCustomer.card.id, customerId: serfinsaCustomer.customer.id});
                    }).catch(err => {
                        return reject(err);
                    });
                }).catch(err => {
                    return reject(err);
                });
            }
        });
    });
}

let paySubscription = (serfinsaId, customerIdSerfinsa, subscription) => {
    return new Promise((resolve, reject) => {
        serfinsaCardsRepository.getFiltered({customerId: customerIdSerfinsa}, (err, cards) => {
            if(err) return resolve({error: true, msg: "Customer not found"});
            var cardFound = false;
            for (let index = 0; index < cards.length; index++) {
                const card = cards[index];
                if(card.id === subscription.cardIdSerfinsa){
                    cardFound = true;
                    contributionRepo.getbyId(subscription.contributionId, (err, contribution) => {
                        if (err) return resolve({error: true, msg: err});
                        for (let index = 0; index < contribution.Item.paymentMethods.length; index++) {
                            const element = contribution.Item.paymentMethods[index];
                            if(element.PaymentMethodId == subscription.paymentMethodId) {
                                serfinsaRepository.getPlanById(element.planId, (err, plan) => {
                                    if(err) return resolve({error: true, msg: err});
                                    if(plan.Item) {
                                        generateTransactionSerfinsa({key: card.token, amount: Number(plan.Item.value)}).then(transaction => {
                                            const resTransaction = {transaction: transaction, cardId: card.id, customerId: customerIdSerfinsa};
                                            return serfinsaHandler.handleEvents({transaction: resTransaction, subscription: {Item: subscription}}, (err, data) => {
                                                if (err) return resolve({error: true, msg: err});
                                                return resolve(transaction);
                                            });
                                        }).catch(err => {
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
                }
            }
            if(cardFound === false){
                return resolve({error: true, msg: "The consumer does not have a card"});
            }
        });
    });
}

let createCustomer = paymentData => {
    console.log("Creating customer");
    return new Promise((resolve, reject) => {
        createCustomerSerfinsa(paymentData).then(serfinsaCustomer => {
            serfinsaCustomersRepository.createCustomer({email: paymentData.email, userId: paymentData.userId}, (err, newCustomer) => {
                if(err) return reject(err);
                serfinsaCardsRepository.createCard({token: serfinsaCustomer["Data"][0], auth: serfinsaCustomer["Auth"][0], customerId: newCustomer.id, lastDigits: paymentData.info.substr(paymentData.info.length - 4)}, (err, newCard) => {
                    if(err) return reject(err);
                    verifyCustomerSerfinsa({key: serfinsaCustomer["Data"][0], auth: serfinsaCustomer["Auth"][0]}).then(verifiedCustomer => {
                        return resolve({serfinsaCustomer: serfinsaCustomer, customer: newCustomer, card: newCard});
                    }).catch(err => {
                        return reject(err);
                    });
                });
            });
        }).catch(err => {
            return reject(err);
        });
    });
}

let updateCustomer = (customerId, paymentData) => {
    return new Promise((resolve, reject) => {
        createCustomerSerfinsa(paymentData).then(serfinsaCustomer => {
            serfinsaCardsRepository.createCard({token: serfinsaCustomer["Data"][0], auth: serfinsaCustomer["Auth"][0], customerId: customerId, lastDigits: paymentData.info.substr(paymentData.info.length - 4)}, (err, newCard) => {
                if(err) return reject(err);
                verifyCustomerSerfinsa({key: serfinsaCustomer["Data"][0], auth: serfinsaCustomer["Auth"][0]}).then(verifiedCustomer => {
                    return resolve({serfinsaCustomer: serfinsaCustomer, card: newCard});
                }).catch(err => {
                    return reject(err);
                });
            });
        }).catch(err => {
            return reject(err);
        });
    });
}

let makePayment = (serfinsaCustomer, paymentData) => {
    return new Promise((resolve, reject) => {
        generateTransactionSerfinsa({key: serfinsaCustomer["Data"][0], amount: paymentData.transaction_amount}).then(transaction => {
            return resolve(transaction);
        }).catch(err => {
            return reject(err);
        });
    });
}

let createCustomerSerfinsa = (customerData) => {
    return new Promise( async (resolve, reject) => {
        try {
            console.log("Creating customer Serfinsa");
            const url = process.env.SERFINSA_URL;
            const headersAction = {
            'Content-Type': 'text/xml;charset=UTF-8',
            'soapAction': 'http://buypass.service.serfinsa.com/CreateCliente',
            };
            const xml = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><CreateCliente xmlns="http://buypass.service.serfinsa.com/"><e><Rtl>' +
                        process.env.SERFINSA_RTL + '</Rtl><Info>' + 
                        customerData.info + '</Info><InfoV>' + 
                        customerData.infov + '</InfoV><InfoS>' + 
                        customerData.infos + '</InfoS></e></CreateCliente></soap:Body></soap:Envelope>';
            const { response } = await soapRequest({ url: url, headers: headersAction, xml: xml });
            const { headers, body, statusCode } = response;
            console.log(response);
            console.log("IMPORTANT", JSON.stringify(body));
            if(statusCode == 200) {
                parseString(body, (err, result) => {
                    if(result["soap:Envelope"]["soap:Body"][0]["CreateClienteResponse"][0]["CreateClienteResult"][0]["IsPersist"][0] == "true"){
                        resolve(result["soap:Envelope"]["soap:Body"][0]["CreateClienteResponse"][0]["CreateClienteResult"][0]);
                    }
                    else {
                        reject(result["soap:Envelope"]["soap:Body"][0]["CreateClienteResponse"][0]["CreateClienteResult"][0]["Message"][0]);
                    }
                });
            }
            else {
                reject("Customer could not be created");
            }
        } catch(e) {
            console.log(e);
            reject("Customer could not be created");
        }
    });
}

let deleteCustomerSerfinsa = async (customerData) => {
    const url = process.env.SERFINSA_URL;
	const headersAction = {
      'Content-Type': 'text/xml;charset=UTF-8',
      'soapAction': 'http://buypass.service.serfinsa.com/DeleteCliente',
    };
    const xml = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><DeleteCliente xmlns="http://buypass.service.serfinsa.com/"><e><Rtl>' +
                process.env.SERFINSA_RTL + '</Rtl><Key>' + 
                customerData.key + '</Key></e></DeleteCliente></soap:Body></soap:Envelope>';

    const { response } = await soapRequest({ url: url, headers: headersAction, xml: xml });
    const { headers, body, statusCode } = response;
    console.log(response);
    return new Promise((resolve, reject) => {
        if(statusCode == 200) {
            parseString(body, (err, result) => {
                if(result["soap:Envelope"]["soap:Body"][0]["DeleteClienteResponse"][0]["DeleteClienteResult"][0]["IsPersist"][0] == "true"){
                    resolve(true);
                }
                else {
                    reject(false);
                }
            });
        }
        else {
            reject("Customer could not be deleted");
        }
    });
} 

let verifyCustomerSerfinsa = (customerData) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Checking Customer Serfinsa");
            const url = process.env.SERFINSA_URL;
            const headersAction = {
            'Content-Type': 'text/xml;charset=UTF-8',
            'soapAction': 'http://buypass.service.serfinsa.com/VerifyClient',
            };
            const amount = 1 * 100;
            const countC = amount.toString().length;
            const addc = 12 - countC;
            var antes = "";
            for (let index = 0; index < addc; index++) {
                antes = "0" + antes;
            }
            const finalAmount = antes + amount.toString();
            const xml = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><VerifyClient xmlns="http://buypass.service.serfinsa.com/"><e><Rtl>' +
                        process.env.SERFINSA_RTL + '</Rtl><Key>' + 
                        customerData.key + '</Key><Amount>' + 
                        finalAmount + '</Amount><Auth>' + 
                        customerData.auth + '</Auth></e></VerifyClient></soap:Body></soap:Envelope>';
            console.log(xml);
            const { response } = await soapRequest({ url: url, headers: headersAction, xml: xml });
            const { headers, body, statusCode } = response;
            console.log(response);
            if(statusCode == 200) {
                parseString(body, (err, result) => {
                    resolve(result);
                });
            }
            else {
                reject("Customer could not be verified");
            }
        } catch(e) {
            console.log(e);
            reject("Customer could not be created");
        }
    });
} 

let generateTransactionSerfinsa = (customerData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const url = process.env.SERFINSA_URL;
            const headersAction = {
            'Content-Type': 'text/xml;charset=UTF-8',
            'soapAction': 'http://buypass.service.serfinsa.com/RequestBuy',
            };
            const amount = Number(customerData.amount) * 100;
            const countC = amount.toString().length;
            const addc = 12 - countC;
            var antes = "";
            for (let index = 0; index < addc; index++) {
                antes = "0" + antes;
            }
            const finalAmount = antes + amount.toString();
            const xml = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><RequestBuy xmlns="http://buypass.service.serfinsa.com/"><e><Rtl>' +
                        process.env.SERFINSA_RTL + '</Rtl><Key>' + 
                        customerData.key + '</Key><Amount>' + 
                        finalAmount + '</Amount><Aditional></Aditional></e></RequestBuy></soap:Body></soap:Envelope>';

            const { response } = await soapRequest({ url: url, headers: headersAction, xml: xml });
            const { headers, body, statusCode } = response;
            console.log(response);
            if(statusCode == 200) {
                parseString(body, (err, result) => {
                    if(result["soap:Envelope"]["soap:Body"][0]["RequestBuyResponse"][0]["RequestBuyResult"][0]["IsApproved"][0] == "true"){
                        resolve(result["soap:Envelope"]["soap:Body"][0]["RequestBuyResponse"][0]["RequestBuyResult"][0]);
                    }
                    else {
                        reject("Transaction could not be created");
                    }
                });
            }
            else {
                reject("Transaction could not be created");
            }
        } catch(e) {
            console.log(e);
            reject("Customer could not be created");
        }
    });
} 

module.exports = {
    createCustomerSerfinsa,
    deleteCustomerSerfinsa,
    verifyCustomerSerfinsa,
    generateTransactionSerfinsa,
    processPayment,
    paySubscription
}