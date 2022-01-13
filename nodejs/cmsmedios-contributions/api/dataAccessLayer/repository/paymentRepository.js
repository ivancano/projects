const uuidv4 = require('uuid/v4')
var AWS = require("aws-sdk");
var table = process.env.cmsPayments;

let create = (payment, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();
    payment.createdDate = timeStamp;
    var params = {
        TableName: table,
        Item: payment,
        ReturnValues: 'ALL_OLD'
    };
    return docClient.put(params, (err) => {
        return callback(err, payment);
    });
}

let getById = (id, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            "id": id
        }
    };
    return docClient.get(params, callback);
}

let getFiltered = (filters, callback) => {
    return getAll((err, data) => {
        if (err) {
            return callback(err);
        } else {
            if (filters.suscriptionId !== '' && filters.suscriptionId !== undefined) {
                data = data.filter((payments) => {
                    return payments.suscriptionId == filters.suscriptionId;
                });
            }
            if (filters.dateFrom !== '' && filters.dateFrom !== undefined) {
                data = data.filter((payments) => {
                    return payments.createdDate >= filters.dateFrom;
                });
            }
            if (filters.dateTo !== '' && filters.dateTo !== undefined) {
                data = data.filter((payments) => {
                    return payments.createdDate >= filters.dateTo;
                });
            }
            if (filters.contributionId !== '' && filters.contributionId !== undefined) {
                data = data.filter((payments) => {
                    return payments.contributionId == filters.contributionId;
                });
            }
            if (filters.paymentMethodId !== '' && filters.paymentMethodId !== undefined) {
                data = data.filter((payments) => {
                    return payments.paymentMethodId == filters.paymentMethodId;
                });
            }
            if (filters.userId !== '' && filters.userId !== undefined) {
                data = data.filter((payments) => {
                    return payments.userId == filters.userId;
                });
            }

            return callback(null, data);
        }
    })
}

let getAll = (callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let items = [];
    var queryExecute = [];

    let scanParams = {
        TableName: table
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
    getById,
    getFiltered
}