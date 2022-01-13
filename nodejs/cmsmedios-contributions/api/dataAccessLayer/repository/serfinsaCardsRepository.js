var AWS = require("aws-sdk");
var uuid = require("uuid/v4");
var table = process.env.cmsSerfinsaCards;

let createCard = (card, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();

    let planModel = {
        id: uuid(),
        createdDate: timeStamp,
        token: card.token,
        auth: card.auth,
        customerId: card.customerId,
        lastDigits: card.lastDigits
    };
    var params = {
        TableName: table,
        Item: planModel,
        ReturnValues: 'ALL_OLD'
    };
    return docClient.put(params, (err) => {
        return callback(err, planModel);
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
    return docClient.get(params).promise();
}

let getAll = (callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let items = [];
    var queryExecute = [];

    let scanParams = {
        TableName: table,
        ProjectionExpression: 'id, #tk, customerId, lastDigits',
        ExpressionAttributeNames: {
            '#tk': 'token'
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

let getFiltered = (filters, callback) => {
    return getAll((err, data) => {
        if (err) {
            return callback(err);
        } else {
            if (filters.customerId !== '' && filters.customerId !== undefined) {
                data = data.filter((card) => {
                    return card.customerId == filters.customerId;
                });
            }
            if (filters.lastDigits !== '' && filters.lastDigits !== undefined) {
                data = data.filter((card) => {
                    return card.lastDigits == filters.lastDigits;
                });
            }

            return callback(null, data);
        }
    })
}

let deleteCard = (cardId, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            'id': cardId
        },
        ConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ':id': cardId
        },
        ReturnValues: 'NONE'
    };

    return docClient.delete(params, callback);
}

module.exports = {
    createCard,
    getById,
    getAll,
    getFiltered,
    deleteCard
}