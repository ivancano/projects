var AWS = require("aws-sdk");
var uuid = require("uuid/v4");
var table = process.env.cmsSubscriptions;
const moment = require('moment');

let create = (subscription, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();

    subscription.id = uuid();
    subscription.userId = subscription.userId
    subscription.createdDate = timeStamp;
    subscription.updatedDate = 0;
    subscription.deletedDate = 0;
    subscription.paypalId = "";
    subscription.payuId = "";
    subscription.mercadopagoId = [];
    subscription.customerIdMercadopago = "";
    subscription.cardIdMercadopago = "";
    subscription.serfinsaId = [];
    subscription.cardIdSerfinsa = "";
    subscription.customerIdSerfinsa = "";

    var params = {
        TableName: table,
        Item: subscription,
        ReturnValues: 'ALL_OLD'
    };
    return docClient.put(params, (err) => {
        return callback(err, subscription);
    });
}

let update = (subscription, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            'id': subscription.id
        },
        UpdateExpression: 'SET paymentMethod=:pm, userId=:u, updatedDate=:du, anonymus=:anonymus, active=:act, contributionId=:contId, #st=:st',
        ExpressionAttributeValues: {
            ':pm': subscription.paymentMethodId,
            ':u': subscription.userId,
            ':du': timeStamp,
            ':anonymus': subscription.anonymus,
            ':act': subscription.active,
            ':contId': subscription.contributionId,
            ':st': subscription.state
        },
        ExpressionAttributeNames: {
            '#st': 'state'
        },
        ReturnValues: 'UPDATED_NEW'
    };
    return docClient.update(params, callback);
}

let updatePaymentId = (subscription, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            'id': subscription.id
        },
        UpdateExpression: 'SET paypalId=:pp, payuId=:pu, mercadopagoId=:mp, cardIdMercadopago=:ci, customerIdMercadopago=:cm, serfinsaId=:s, cardIdSerfinsa=:cis, customerIdSerfinsa=:cms',
        ExpressionAttributeValues: {
            ':pp': subscription.paypalId,
            ':pu': subscription.payuId,
            ':mp': subscription.mercadopagoId,
            ':ci': subscription.cardIdMercadopago,
            ':cm': subscription.customerIdMercadopago,
            ':s': subscription.serfinsaId,
            ':cis': subscription.cardIdSerfinsa,
            ':cms': subscription.customerIdSerfinsa
        },
        ReturnValues: 'UPDATED_NEW'
    };
    return docClient.update(params, callback);
}

let appendPaymentMercadoPago = (subscription, mercadopagoId, callback) => {
    return new Promise((resolve, reject) => {
        let timeStamp = Date.now();
        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: table,
            Key: {
                'id': subscription.id
            },
            UpdateExpression: 'SET mercadopagoId=:mp',
            ExpressionAttributeValues: {
                ':mp': mercadopagoId
            },
            ReturnValues: 'UPDATED_NEW'
        };
        docClient.update(params, (err) => {
            if(err) return reject(err);
            return resolve(subscription);
        });
    });    
}

let appendPaymentSerfinsa = (subscription, serfinsaId, callback) => {
    return new Promise((resolve, reject) => {
        let timeStamp = Date.now();
        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: table,
            Key: {
                'id': subscription.id
            },
            UpdateExpression: 'SET serfinsaId=:mp',
            ExpressionAttributeValues: {
                ':mp': serfinsaId
            },
            ReturnValues: 'UPDATED_NEW'
        };
        docClient.update(params, (err) => {
            if(err) return reject(err);
            return resolve(subscription);
        });
    });    
}

let updateDueDate = (subscription, payment, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            'id': subscription.id
        },
        UpdateExpression: 'SET nextDueDate=:dd, lastPayment=:lp',
        ExpressionAttributeValues: {
            ':dd': payment.nextDueDate,
            ':lp': payment.lastPayment
        },
        ReturnValues: 'UPDATED_NEW'
    };
    return docClient.update(params, callback);
}

let deleteSubscription = (subscriptionId, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            'id': subscriptionId
        },
        UpdateExpression: 'SET deletedDate=:del, active=:act, #st=:sta, updatedDate=:upd',
        ExpressionAttributeValues: {
            ':del': timeStamp,
            ':upd': timeStamp,
            ':act': false,
            ':sta': 'Inactive'
        },
        ExpressionAttributeNames: {
            '#st': 'state'
        },
        ReturnValues: 'ALL_NEW'
    };

    return docClient.update(params, callback);
}

let getbyId = (id, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            "id": id
        }
    };
    return docClient.get(params, callback);
}

let getbyPaymentMethodId = (paymentMethod, id, callback) => {
    const docClient = new AWS.DynamoDB.DocumentClient();
    let scanParams = {
        TableName: table,
        FilterExpression: '#paymentMethodColumn = :id',
        ExpressionAttributeNames: {
            '#paymentMethodColumn': paymentMethod
        },
        ExpressionAttributeValues: {
            ':id': id
        },
    };
    return docClient.scan(scanParams, callback);
}

let getFiltered = (filters, callback) => {
    return getAll((err, data) => {
        if (err) {
            return callback(err);
        } else {
            if (filters.suscriptionId !== '' && filters.suscriptionId !== undefined) {
                data = data.filter((subscription) => {
                    return subscription.id == filters.suscriptionId;
                });
            }
            if (filters.contributionId !== '' && filters.contributionId !== undefined) {
                data = data.filter((subscription) => {
                    return subscription.contributionId == filters.contributionId;
                });
            }
            if (filters.paymentMethodId !== '' && filters.paymentMethodId !== undefined) {
                data = data.filter((subscription) => {
                    return subscription.paymentMethodId == filters.paymentMethodId;
                });
            }
            if (filters.dateFrom !== '' && filters.dateFrom !== undefined) {
                data = data.filter((subscription) => {
                    return subscription.createdDate >= filters.dateFrom;
                });
            }
            if (filters.dateTo !== '' && filters.dateTo !== undefined) {
                data = data.filter((subscription) => {
                    return subscription.createdDate <= filters.dateTo;
                });
            }
            if (filters.username !== '' && filters.username !== undefined) {
                data = data.filter((subscription) => {
                    return subscription.username == filters.username;
                });
            }
            if (filters.mercadopagoId !== '' && filters.mercadopagoId !== undefined) {
                data = data.filter((subscription) => {
                    return subscription.mercadopagoId.includes(filters.mercadopagoId);
                });
            }
            if (filters.serfinsaId !== '' && filters.serfinsaId !== undefined) {
                data = data.filter((subscription) => {
                    return subscription.serfinsaId.includes(filters.serfinsaId);
                });
            }
            if (filters.cardIdSerfinsa !== '' && filters.cardIdSerfinsa !== undefined) {
                data = data.filter((subscription) => {
                    return subscription.cardIdSerfinsa.includes(filters.cardIdSerfinsa);
                });
            }
            if (filters.state !== '' && filters.state !== undefined) {
                data = data.filter((subscription) => {
                    return subscription.state.includes(filters.state);
                });
            }

            return callback(null, data);
        }
    })
}

let getSubscriptionsExpired = (provider, callback) => { 
    return getAll((err, data) => {
        if (err) {
            return callback(err);
        } else {
            if (provider === "mercadopago") {
                data = data.filter((subscription) => {
                    return subscription.mercadopagoId !== null && subscription.mercadopagoId !== undefined && subscription.mercadopagoId.length > 0;
                });
            }
            if (provider === "serfinsa") {
                data = data.filter((subscription) => {
                    return subscription.serfinsaId !== null && subscription.serfinsaId !== undefined && subscription.serfinsaId.length > 0;
                });
            }

            data = data.filter((subscription) => {
                return subscription.type !== null && subscription.type !== undefined && subscription.type == 'Recurrente'
            });
            
            data = data.filter((subscription) => {
                return subscription.nextDueDate !== null && subscription.nextDueDate !== undefined && moment(subscription.nextDueDate).isBefore(moment())
            });

            return callback(null, data);
        }
    })
}

let getAll = (callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let items = [];
    var queryExecute = [];

    let scanParams = {
        TableName: table,
        ProjectionExpression: 'id,active, anonymus,contributionId, username,createdDate,updatedDate,deletedDate,paymentMethodId,#st,userId,mercadopagoId,nextDueDate,lastPayment,#typ, cardIdMercadopago, customerIdMercadopago, serfinsaId, cardIdSerfinsa, customerIdSerfinsa',
        ExpressionAttributeNames: {
            '#st': 'state',
            '#typ': 'type'
        }
    };

    queryExecute = (callback) => {
        docClient.scan(scanParams, (err, data) => {
            if (err) {
                return callback(err, null);
            } else {
                items = items.concat(data.Items);
                if (data.LastEvaluatedKey) {
                    scanParams.ExclusiveStartKey = data.LastEvaluatedKey;
                    queryExecute(callback);
                } else {
                    return callback(null, items);
                }
            }
        });
    }
    return queryExecute(callback);
}



module.exports = {
    create,
    getbyId,
    update,
    deleteSubscription,
    getFiltered,
    updatePaymentId,
    getbyPaymentMethodId,
    updateDueDate,
    getSubscriptionsExpired,
    appendPaymentMercadoPago,
    appendPaymentSerfinsa
}