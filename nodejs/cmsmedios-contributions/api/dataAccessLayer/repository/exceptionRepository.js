var AWS = require("aws-sdk");
var table = process.env.cmsExceptions;
const uuid = require('uuid/v4');

let createIfNotExists = (message, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();
    let scanParams = {
        TableName: table,
        FilterExpression: 'messageEn = :men',
        ExpressionAttributeValues: {
            ':men': message.en
        },
    };

    return docClient.scan(scanParams, (err, response) => {
        if(err) return callback(err);
        if(response.Items.length === 0){
            let planModel = {
                messageEn: message.en,
                messageEs: message.es
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
        else {
            let planModel = {
                messageEn: response.Items[0].messageEn,
                messageEs: response.Items[0].messageEs
            };
            return callback(err, planModel);
        }
    });
}

let getAllExceptions = (callback) => {
    // Brings all the contributions from Dynamo at once.
    let docClient = new AWS.DynamoDB.DocumentClient();
    let items = [];
    let scanParams = {
        TableName: table
    };
    let queryExecute = (callback) => {
        docClient.scan(scanParams, (err, data) => {
            if (err) {
                return callback(err, null);
            } else {
                items = items.concat(data.Items);
                return callback(null, items);
            }
        });
    }
    return queryExecute(callback);
}

let getException = (text, callback) => {
    return getAllExceptions((err, data) => {
        if (err) {
            return callback(err);
        } else {
            if (text !== '' && text !== undefined) {
                data = data.filter((exception) => {
                    return exception.en.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(exception.en.toLowerCase());
                });
            }
            return callback(null, data);
        }
    })
}

module.exports = {
    createIfNotExists,
    getAllExceptions,
    getException
}