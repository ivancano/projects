var AWS = require("aws-sdk");
var uuid = require("uuid/v4");
var table = process.env.cmsSerfinsaCustomers;

let getCustomer = (email, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let scanParams = {
        TableName: table,
        FilterExpression: 'email = :e',
        ExpressionAttributeValues: {
            ':e': email
        },
    };

    return docClient.scan(scanParams, (err, customerResponse) => {
        return callback(err, customerResponse.Items);
    });
}

let getCustomerByUserId = (userId, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    let scanParams = {
        TableName: table,
        FilterExpression: 'userId = :e',
        ExpressionAttributeValues: {
            ':e': userId
        },
    };

    return docClient.scan(scanParams, (err, customerResponse) => {
        return callback(err, customerResponse.Items);
    });
}

let createCustomer = (user, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();

    let planModel = {
        id: uuid(),
        createdDate: timeStamp,
        email: user.email,
        userId: user.userId
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

let addCard = (customerConfig, cards, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            'id': customerConfig.id
        },
        UpdateExpression: 'SET cards=:c',
        ExpressionAttributeValues: {
            ':c': cards
        },
        ReturnValues: 'UPDATED_NEW'
    };

    return docClient.update(params, callback);
}

module.exports = {
    createCustomer,
    addCard,
    getCustomer,
    getCustomerByUserId
}