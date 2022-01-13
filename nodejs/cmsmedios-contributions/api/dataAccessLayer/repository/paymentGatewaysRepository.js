var AWS = require("aws-sdk");
var table = process.env.cmspaymentGateways;

let create = (gateway, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();
    gateway.createdDate = timeStamp;
    var params = {
        TableName: table,
        Item: gateway,
        ReturnValues: 'ALL_OLD'
    };
    return docClient.put(params, (err) => {
        return callback(err, gateway);
    });
}

let update = (customerConfig, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            'id': customerConfig.id
        },
        UpdateExpression: 'SET options=:o',
        ExpressionAttributeValues: {
            ':o': customerConfig.options
        },
        ReturnValues: 'UPDATED_NEW'
    };

    return docClient.update(params, callback);
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
        ProjectionExpression: 'id,#nm, description,#ty,webhook,createdDate',
        ExpressionAttributeNames: {
            '#nm': 'name',
            '#ty': 'type'
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
    getById,
    update,
    getAll
}