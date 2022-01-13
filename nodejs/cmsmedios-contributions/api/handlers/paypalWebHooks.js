const paypalService = require('../paymentMethods/index').paypal;
const userRepo = require('../dataAccessLayer/repository/index').UserRepository;
const subscriptionRepo = require('../dataAccessLayer/repository/index').SubscriptionRepository;
const paymentRepo = require('../dataAccessLayer/repository/index').PaymentRepository;
const uuid = require('uuid/v4');
const paymentEnum = require('../helpers').PaymentsEnum.paymentMethodsId;
let handleEvents = (notification, callback) => {
    let userEmail = "";
    let status = "";
    switch (notification.event_type) {
        case 'PAYMENT.SALE.COMPLETED':
            subscriptionPaypalId = notification.resource.billing_agreement_id;
            return registerPayment(notification, callback, null, subscriptionPaypalId);
            break;
        case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
            let errormsg = notification.summary;
            subscriptionPaypalId = notification.resource.id;
            return registerFailurePayment(notification, callback, errormsg, subscriptionPaypalId);
            break;
        case 'BILLING.SUBSCRIPTION.ACTIVATED':
            userEmail = notification.resource.subscriber.email_address; //user email address
            status = notification.resource.status
            subscriptionPaypalId = notification.resource.id
            return updateSubscription(userEmail, status, callback, true, subscriptionPaypalId);
            break;
        case 'BILLING.SUBSCRIPTION.CANCELLED':
            userEmail = notification.resource.payer.payer_info.email; //user email address
            status = notification.resource.state || "CANCELLED";
            subscriptionPaypalId = notification.resource.id;
            return updateSubscription(userEmail, status, callback, false, subscriptionPaypalId);
            break;

        case 'BILLING.SUBSCRIPTION.EXPIRED':
            status = notification.resource.status || "EXPIRED";
            subscriptionPaypalId = notification.resource.id;
            return updateSubscription(userEmail, status, callback, false, subscriptionPaypalId);
            break;

        case 'BILLING.SUBSCRIPTION.SUSPENDED':
            status = notification.resource.state || "SUSPENDED";
            subscriptionPaypalId = notification.resource.id;
            return updateSubscription(userEmail, status, callback, false, subscriptionPaypalId);
            break;
        case 'BILLING.SUBSCRIPTION.RE-ACTIVATED':
            userEmail = notification.resource.payer.payer_info.email; //user email address
            status = notification.resource.state || "RE-ACTIVATED";
            subscriptionPaypalId = notification.resource.id
            return updateSubscription(userEmail, status, callback, true, subscriptionPaypalId);
            break;
        case 'CHECKOUT.ORDER.APPROVED':
            return registerSinglePayment(notification, callback);
            break;

    }
}

let registerSinglePayment = (notification, callback) => {
    let userId, amount, currency;
    notification.resource.purchase_units.forEach(element => {
        subscriptionId = element.custom_id.split(',')[0];
        userId = element.custom_id.split(',')[1];
        amount = element.payments.captures[0].amount.value;
        currency = element.payments.captures[0].amount.currency_code;
        status = element.payments.captures[0].status;
    });

    return userRepo.getById(userId, (err, user) => {
        if (err) {
            return callback(err);
        }
        if (user.length == 0) {
            let paymentModel = {
                id: uuid(),
                paymentMethodId: paymentEnum.PaypalWebChk.value,
                amount: amount,
                currency: currency,
                status: status,
                contributionId: false,
                userId: userId,
                payload: JSON.stringify(notification),
                paymentDate: notification.create_time,
                subscriptionId: false
            };
            return paymentRepo.create(paymentModel, (err, data) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, data);
            })
        } else {
            user = user[0];
            return subscriptionRepo.getbyId(subscriptionId, (err, data) => {
                if (err) {
                    return callback(err);
                }
                if (Object.keys(data).length > 0) //si el usuario tiene subscription guardo
                {
                    let subscription = data.Item
                    let paymentModel = {
                        id: uuid(),
                        paymentMethodId: subscription.paymentMethodId,
                        amount: amount,
                        currency: currency,
                        status: status,
                        contributionId: subscription.contributionId,
                        userId: user.id,
                        payload: JSON.stringify(notification),
                        paymentDate: notification.create_time,
                        subscriptionId: subscription.id
                    };
                    return paymentRepo.create(paymentModel, (err, data) => {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, data)
                    })
                } else {
                    let paymentModel = {
                        id: uuid(),
                        paymentMethodId: paymentEnum.PaypalWebChk.value,
                        amount: amount,
                        currency: currency,
                        status: status,
                        contributionId: false,
                        userId: user.id,
                        payload: JSON.stringify(notification),
                        paymentDate: notification.create_time,
                        subscriptionId: false
                    };
                    return paymentRepo.create(paymentModel, (err, data) => {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, data);
                    });
                }
            });
        }

    });
}


let updateSubscription = (userEmail, status, callback, isActive, subscriptionPaypalId) => {
    return subscriptionRepo.getbyPaymentMethodId('paypalId', subscriptionPaypalId, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (Object.keys(data.Items).length > 0) //if user have a subscription, update subscription
        {
            let subscription = data.Items[0];
            subscription.active = isActive;
            subscription.state = status;
            return subscriptionRepo.update(subscription, (err, data) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, '')
            });
        } else {
            return callback(err); //not subscription found
        }
    });
}


let registerPayment = (notification, callback, errormsg, subscriptionId) => {
    return paypalService.getSubscription(subscriptionId).then((paypalSubscription) => {
        let userEmail = paypalSubscription.subscriber.email_address; //user email address
        userRepo.getByEmail(userEmail, (err, users) => {
            if (err) {
                return callback(err);
            } else {
                if (users.Count == 0) {
                    return subscriptionRepo.getbyPaymentMethodId('paypalId', subscriptionId, (err, data) => {
                        if (err) {
                            return callback(err);
                        }
                        if (Object.keys(data).length > 0) //si el usuario tiene subscription guardo
                        {
                            let subscription = data.Items[0];
                            let paymentModel = {
                                id: uuid(),
                                paymentMethodId: subscription.paymentMethodId,
                                amount: notification.resource.amount.total,
                                currency: notification.resource.amount.currency,
                                contributionId: subscription.contributionId,
                                userId: subscription.userId,
                                status: notification.resource.state,
                                payload: JSON.stringify(notification),
                                paymentDate: notification.create_time,
                                userEmail: userEmail,
                                ErrorDescription: errormsg || '-',
                                subscriptionId: subscription.id
                            };
                            return paymentRepo.create(paymentModel, (err, data) => {
                                if (err) {
                                    return callback(err);
                                }
                                return callback(null, data)
                            })
                        } else {
                            let paymentModel = {
                                id: uuid(),
                                paymentMethodId: paymentEnum.PaypalSub.value,
                                amount: notification.resource.amount.total,
                                currency: notification.resource.amount.currency,
                                contributionId: false,
                                userId: false,
                                userEmail: userEmail,
                                status: notification.resource.state,
                                payload: JSON.stringify(notification),
                                paymentDate: notification.create_time,
                                ErrorDescription: errormsg || '-',
                                subscriptionId: false
                            };
                            return paymentRepo.create(paymentModel, (err, data) => {
                                if (err) {
                                    return callback(err);
                                }
                                return callback(null, data);
                            });
                        }
                    });
                } else {
                    let user = users.Items[0];
                    return subscriptionRepo.getbyPaymentMethodId('paypalId', subscriptionId, (err, data) => {
                        if (err) {
                            return callback(err);
                        }
                        if (Object.keys(data).length > 0) //si el usuario tiene subscription guardo
                        {
                            let subscription = data.Items[0];
                            let paymentModel = {
                                id: uuid(),
                                paymentMethodId: subscription.paymentMethodId,
                                amount: notification.resource.amount.total,
                                currency: notification.resource.amount.currency,
                                contributionId: subscription.contributionId,
                                userId: user.id,
                                status: notification.resource.state,
                                payload: JSON.stringify(notification),
                                paymentDate: notification.create_time,
                                ErrorDescription: errormsg || '-',
                                subscriptionId: subscription.id
                            };
                            return paymentRepo.create(paymentModel, (err, data) => {
                                if (err) {
                                    return callback(err);
                                }
                                return callback(null, data)
                            })
                        } else {
                            let paymentModel = {
                                id: uuid(),
                                paymentMethodId: paymentEnum.PaypalSub.value,
                                amount: notification.resource.amount.total,
                                currency: notification.resource.amount.currency,
                                contributionId: false,
                                userId: user.id,
                                status: notification.resource.state,
                                payload: JSON.stringify(notification),
                                paymentDate: notification.create_time,
                                ErrorDescription: errormsg || '-',
                                subscriptionId: false
                            };
                            return paymentRepo.create(paymentModel, (err, data) => {
                                if (err) {
                                    return callback(err);
                                }
                                return callback(null, data);
                            });
                        }
                    });
                }
            }
        });
    }).catch((err) => {
        return callback(err);
    });
};

let registerFailurePayment = (notification, callback, errormsg, subscriptionId) => {
    return paypalService.getSubscription(subscriptionId).then((paypalSubscription) => {
        let userEmail = paypalSubscription.subscriber.email_address; //user email address
        userRepo.getByEmail(userEmail, (err, users) => {
            if (err) {
                return callback(err);
            } else {
                if (users.Count == 0) {
                    let paymentModel = {
                        id: uuid(),
                        paymentMethodId: paymentEnum.PaypalSub.value,
                        amount: notification.resource.billing_info.outstanding_balance.value,
                        currency: notification.resource.billing_info.outstanding_balance.currency_code,
                        contributionId: false,
                        userId: false,
                        userEmail: userEmail,
                        status: notification.resource.state,
                        payload: JSON.stringify(notification),
                        paymentDate: notification.create_time,
                        ErrorDescription: errormsg || '-',
                        subscriptionId: false
                    };
                    return paymentRepo.create(paymentModel, (err, data) => {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, data);
                    })
                } else {
                    let user = users.Items[0];
                    return subscriptionRepo.getbyPaymentMethodId('paypalId', subscriptionId, (err, data) => {
                        if (err) {
                            return callback(err);
                        }
                        if (Object.keys(data).length > 0) //si el usuario tiene subscription guardo
                        {
                            let subscription = data.Items[0];
                            let paymentModel = {
                                id: uuid(),
                                paymentMethodId: subscription.paymentMethodId,
                                amount: notification.resource.billing_info.outstanding_balance.value,
                                currency: notification.resource.billing_info.outstanding_balance.currency_code,
                                contributionId: subscription.contributionId,
                                userId: user.id,
                                status: notification.resource.state,
                                payload: JSON.stringify(notification),
                                paymentDate: notification.create_time,
                                ErrorDescription: errormsg || '-',
                                subscriptionId: subscription.id
                            };
                            return paymentRepo.create(paymentModel, (err, data) => {
                                if (err) {
                                    return callback(err);
                                }
                                return callback(null, data)
                            })
                        } else {
                            let paymentModel = {
                                id: uuid(),
                                paymentMethodId: paymentEnum.PaypalSub.value,
                                amount: notification.resource.billing_info.outstanding_balance.value,
                                currency: notification.resource.billing_info.outstanding_balance.currency_code,
                                contributionId: false,
                                userId: user.id,
                                status: notification.resource.state,
                                payload: JSON.stringify(notification),
                                paymentDate: notification.create_time,
                                ErrorDescription: errormsg || '-',
                                subscriptionId: false
                            };
                            return paymentRepo.create(paymentModel, (err, data) => {
                                if (err) {
                                    return callback(err);
                                }
                                return callback(null, data);
                            });
                        }
                    });
                }
            }
        });
    }).catch((err) => {
        return callback(err);
    });
};


module.exports = {
    handleEvents
}