const userRepo = require('../dataAccessLayer/repository/index').UserRepository;
const subscriptionRepo = require('../dataAccessLayer/repository/index').SubscriptionRepository;
const contributionRepo = require('../dataAccessLayer/repository/index').ContributionRepository;
const paymentRepo = require('../dataAccessLayer/repository/index').PaymentRepository;
const mercadoPagoRepo = require('../dataAccessLayer/repository/index').MercadoPagoRepository;
const uuid = require('uuid/v4');
const mercadoPagoRepository = require('../dataAccessLayer/repository/mercadoPagoRepository');
const paymentEnum = require('../helpers').PaymentsEnum.paymentMethodsId;
const moment = require('moment');

let handleEvents = (notification, callback) => {
    if(notification.action == "payment.created"){
        registerSinglePayment(notification, callback);
    }
}


let registerSinglePayment = (notification, callback) => {
    mercadopagoId = parseInt(notification.data.id);
    return subscriptionRepo.getFiltered({mercadopagoId: mercadopagoId}, (err, data) => {
        if (err) {
            return callback(err);
        }
        if (Object.keys(data).length > 0) {
            let subscription = data[0];
            let paymentModel = {
                id: uuid(),
                paymentMethodId: subscription.paymentMethodId,
                contributionId: subscription.contributionId,
                userId: subscription.userId,
                mercadopagoId: notification.mercadopagoId,
                payload: JSON.stringify(notification),
                paymentDate: notification.date_created,
                subscriptionId: subscription.id
            };
            return paymentRepo.create(paymentModel, (err, data) => {
                if (err) {
                    return callback(err);
                }
                //return callback(null, data[0])
                return updatePaymentDateSubscription(notification, subscription, (err, payment) => {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, payment)
                });
            })
        }
    });
};

let updatePaymentDateSubscription = (notification, subscription, callback) => {
    let payment = {
        lastPayment: notification.date_created,
        nextDueDate: null
    };
    contributionRepo.getbyId(subscription.contributionId, (err, contribution) => {
        if(err) return callback(err);
        for (let index = 0; index < contribution.Item.paymentMethods.length; index++) {
            const element = contribution.Item.paymentMethods[index];
            if(element.PaymentMethodId == subscription.paymentMethodId){
                mercadoPagoRepository.getPlanById(element.planId, (err, plan) => {
                    if(err) return callback(err);
                    if(plan.Item){
                        if(plan.Item.interval === 'MONTH'){
                            payment.nextDueDate = moment(payment.lastPayment).add(plan.Item.intervalCount, 'months').toISOString();
                        }
                        if(plan.Item.interval === 'WEEK'){
                            payment.nextDueDate = moment(payment.lastPayment).add((plan.Item.intervalCount * 7), 'days').toISOString();
                        }
                        if(plan.Item.interval === 'DAY'){
                            payment.nextDueDate = moment(payment.lastPayment).add(plan.Item.intervalCount, 'days').toISOString();
                        }
                        if(plan.Item.interval === 'YEAR'){
                            payment.nextDueDate = moment(payment.lastPayment).add(plan.Item.intervalCount, 'years').toISOString();
                        }
                    }
                    subscriptionRepo.updateDueDate(subscription, payment, (err, data) => {
                        if(err) return callback(err);
                        callback(null, data);
                    });
                })
            }
        }
    });
}

module.exports = {
    handleEvents
}