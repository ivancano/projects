const userRepo = require('../dataAccessLayer/repository/index').UserRepository;
const subscriptionRepo = require('../dataAccessLayer/repository/index').SubscriptionRepository;
const contributionRepo = require('../dataAccessLayer/repository/index').ContributionRepository;
const paymentRepo = require('../dataAccessLayer/repository/index').PaymentRepository;
const serfinsaRepository = require('../dataAccessLayer/repository/index').SerfinsaRepository;
const uuid = require('uuid/v4');
const paymentEnum = require('../helpers').PaymentsEnum.paymentMethodsId;
const moment = require('moment');

let handleEvents = (notification, callback) => {
    registerSinglePayment(notification, callback);
}


let registerSinglePayment = (notification, callback) => {
    let timeStamp = Date.now();
    let subscription = notification.subscription;
    let paymentModel = {
        id: uuid(),
        paymentMethodId: subscription.Item.paymentMethodId,
        contributionId: subscription.Item.contributionId,
        userId: subscription.Item.userId,
        serfinsaId: subscription.Item.serfinsaId,
        payload: JSON.stringify(notification.transaction),
        paymentDate: timeStamp,
        subscriptionId: subscription.Item.id
    };
    return paymentRepo.create(paymentModel, (err, data) => {
        if (err) {
            return callback(err);
        }
        return updatePaymentDateSubscription(paymentModel, subscription, (err, payment) => {
            if (err) {
                return callback(err);
            }
            return callback(null, payment)
        });
    })
};

let updatePaymentDateSubscription = (paymentModel, subscription, callback) => {
    let payment = {
        lastPayment: paymentModel.paymentDate,
        nextDueDate: null
    };
    contributionRepo.getbyId(subscription.Item.contributionId, (err, contribution) => {
        if(err) return callback(err);
        for (let index = 0; index < contribution.Item.paymentMethods.length; index++) {
            const element = contribution.Item.paymentMethods[index];
            if(element.PaymentMethodId == subscription.Item.paymentMethodId){
                serfinsaRepository.getPlanById(element.planId, (err, plan) => {
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
                    subscriptionRepo.updateDueDate(subscription.Item, payment, (err, data) => {
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