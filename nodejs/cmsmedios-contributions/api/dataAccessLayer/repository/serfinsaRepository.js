var AWS = require("aws-sdk");
var uuid = require("uuid/v4");
var table = process.env.cmsSerfinsa;

let createPlan = (plan, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();

    let planModel = {
        id: uuid(),
        createdDate: timeStamp,
        planCode: plan.planCode,
        description: plan.description,
        interval: plan.interval,
        intervalCount: plan.intervalcount,
        value: plan.value,
        currency: plan.currency
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

let getPlanById = (planId, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: table,
        Key: {
            "id": planId
        }
    };
    return docClient.get(params, callback);
}

module.exports = {
    createPlan,
    getPlanById
}