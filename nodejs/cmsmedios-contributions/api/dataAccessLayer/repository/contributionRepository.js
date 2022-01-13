var AWS = require("aws-sdk");
var table = process.env.cmsContributions;
const uuid = require('uuid/v4');

let create = (contribution, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();
    contribution.id = uuid();
    contribution.createdDate = timeStamp;
    contribution.updatedDate = 0;
    var params = {
        TableName: table,
        Item: contribution,
        ReturnValues: 'ALL_OLD'
    };
    return docClient.put(params, (err) => {
        return callback(err, contribution);
    });
}

let update = (contribution, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            'id': contribution.id
        },
        UpdateExpression: 'SET #nm=:nm, #typ=:ty, updatedDate=:du, amount=:am, frequency=:fq, #st=:st, image=:img, paymentMethods=:pym',
        ExpressionAttributeValues: {
            ':nm': contribution.name,
            ':ty': contribution.type,
            ':du': timeStamp,
            ':am': contribution.amount,
            ':fq': contribution.frequency,
            ':st': contribution.state,
            ':img': contribution.image,
            ':pym': contribution.paymentMethods
        },
        ExpressionAttributeNames: {
            "#nm": "name",
            '#typ': 'type',
            '#st': 'state'
        },
        ReturnValues: 'UPDATED_NEW'
    };
    return docClient.update(params, callback);
}

let deleteContribution = (contributionId, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            'id': contributionId
        },
        ConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ':id': contributionId
        },
        ReturnValues: 'NONE'
    };

    return docClient.delete(params, callback);
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

let getAllContributions = (callback) => {
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
    return getAllContributions((err, data) => {
        if (err) {
            return callback(err);
        } else {
            if (filters.state !== '' && filters.state !== undefined) {
                data = data.filter((contribution) => {
                    return contribution.state.toLowerCase() === filters.state.toLowerCase();
                });
            }
            if (filters.type !== '' && filters.type !== undefined) {
                data = data.filter((contribution) => {
                    return contribution.type.toLowerCase() === filters.type.toLowerCase();
                });
            }
            return callback(null, data);
        }
    })
}

module.exports = {
    create,
    getbyId,
    getFiltered,
    update,
    deleteContribution,
    getAllContributions
}