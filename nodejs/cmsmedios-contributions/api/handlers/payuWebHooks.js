const userRepo = require('../dataAccessLayer/repository/index').UserRepository;
const subscriptionRepo = require('../dataAccessLayer/repository/index').SubscriptionRepository;
const paymentRepo = require('../dataAccessLayer/repository/index').PaymentRepository;
const uuid = require('uuid/v4');
const paymentEnum = require('../helpers').PaymentsEnum.paymentMethodsId;

let handleEvents = (notification, callback) => {
    if (notification.reference_recurring_payment !== undefined) {
        registerSubscriptionPayment(notification, callback);
    } else if (notification.reference_sale !== undefined) {
        registerSinglePayment(notification, callback);
    } else {
        callback(null, true)
    }
}


let registerSubscriptionPayment = (notification, callback) => {
    subscriptionPayuId = notification.reference_recurring_payment.split('_')[0];
    userRepo.getByEmail(notification.email_buyer, (err, users) => {
        if (err) {
            return callback(err);
        } else {
            if (users.Count == 0) {

                return subscriptionRepo.getbyPaymentMethodId('payuId', subscriptionPayuId, (err, data) => {
                    if (err) {
                        return callback(err);
                    }
                    if (Object.keys(data).length > 0) {
                        let subscription = data.Items[0];
                        let paymentModel = {
                            id: uuid(),
                            paymentMethodId: paymentEnum.PayU.value,
                            amount: notification.value,
                            currency: notification.currency,
                            contributionId: subscription.contributionId,
                            userId: subscription.userId,
                            userEmail: notification.email_buyer,
                            status: notification.response_message_pol,
                            payload: JSON.stringify(notification),
                            paymentDate: notification.operation_date,
                            ErrorDescription: notification.response_message_pol || '-',
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
                            paymentMethodId: paymentEnum.PayU.value,
                            amount: notification.value,
                            currency: notification.currency,
                            contributionId: false,
                            userId: false,
                            userEmail: notification.email_buyer,
                            status: notification.response_message_pol,
                            payload: JSON.stringify(notification),
                            paymentDate: notification.operation_date,
                            ErrorDescription: notification.response_message_pol || '-',
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
                return subscriptionRepo.getbyPaymentMethodId('payuId', subscriptionPayuId, (err, data) => {
                    if (err) {
                        return callback(err);
                    }
                    if (Object.keys(data).length > 0) //si el usuario tiene subscription guardo
                    {
                        let subscription = data.Items[0];
                        let paymentModel = {
                            id: uuid(),
                            paymentMethodId: paymentEnum.PayU.value,
                            amount: notification.value,
                            currency: notification.currency,
                            contributionId: subscription.contributionId,
                            userId: user.id,
                            userEmail: notification.email_buyer,
                            status: notification.response_message_pol,
                            payload: JSON.stringify(notification),
                            paymentDate: notification.operation_date,
                            ErrorDescription: notification.response_message_pol || '-',
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
                            paymentMethodId: paymentEnum.PayU.value,
                            amount: notification.value,
                            currency: notification.currency,
                            contributionId: false,
                            userId: user.id,
                            userEmail: notification.email_buyer,
                            status: notification.response_message_pol,
                            payload: JSON.stringify(notification),
                            paymentDate: notification.operation_date,
                            ErrorDescription: notification.response_message_pol || '-',
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
};

let registerSinglePayment = (notification, callback) => {
    subscriptionId = notification.reference_sale;
    userRepo.getByEmail(notification.email_buyer, (err, users) => {
        if (err) {
            return callback(err);
        } else {
            if (users.Count == 0) {
                return subscriptionRepo.getbyId(subscriptionId, (err, data) => {
                    console.log(data);
                    if (err) {
                        return callback(err);
                    }
                    if (Object.keys(data).length > 0) {
                        let subscription = data.Item;
                        let paymentModel = {
                            id: uuid(),
                            paymentMethodId: paymentEnum.PayU.value,
                            amount: notification.value,
                            currency: notification.currency,
                            contributionId: subscription.contributionId,
                            userId: subscription.userId,
                            userEmail: notification.email_buyer,
                            status: notification.response_message_pol,
                            payload: JSON.stringify(notification),
                            paymentDate: notification.transaction_date,
                            ErrorDescription: notification.response_message_pol || '-',
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
                            paymentMethodId: paymentEnum.PayU.value,
                            amount: notification.value,
                            currency: notification.currency,
                            contributionId: false,
                            userId: false,
                            userEmail: notification.email_buyer,
                            status: notification.response_message_pol,
                            payload: JSON.stringify(notification),
                            paymentDate: notification.transaction_date,
                            ErrorDescription: notification.response_message_pol || '-',
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
                return subscriptionRepo.getbyId(subscriptionId, (err, data) => {
                    console.log(data);
                    if (err) {
                        return callback(err);
                    }
                    if (Object.keys(data).length > 0) //si el usuario tiene subscription guardo
                    {
                        let subscription = data.Item;
                        let paymentModel = {
                            id: uuid(),
                            paymentMethodId: paymentEnum.PayU.value,
                            amount: notification.value,
                            currency: notification.currency,
                            contributionId: subscription.contributionId,
                            userId: user.id,
                            userEmail: notification.email_buyer,
                            status: notification.response_message_pol,
                            payload: JSON.stringify(notification),
                            paymentDate: notification.transaction_date,
                            ErrorDescription: notification.response_message_pol || '-',
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
                            paymentMethodId: paymentEnum.PayU.value,
                            amount: notification.value,
                            currency: notification.currency,
                            contributionId: false,
                            userId: user.id,
                            userEmail: notification.email_buyer,
                            status: notification.response_message_pol,
                            payload: JSON.stringify(notification),
                            paymentDate: notification.transaction_date,
                            ErrorDescription: notification.response_message_pol || '-',
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
};

module.exports = {
    handleEvents
}