var AWS = require("aws-sdk");
var uuid = require("uuid/v4");
var table = process.env.cmsMercadoPagoCards;

let createOrGet = (card, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();
    let scanParams = {
        TableName: table,
        FilterExpression: 'cardId = :cid',
        ExpressionAttributeValues: {
            ':cid': card.cardId
        },
    };

    return docClient.scan(scanParams, (err, cardResponse) => {
        if(err) return callback(err);
        if(cardResponse.Items.length > 0){
            let planModel = {
                id: cardResponse.Items[0].id,
                createdDate: cardResponse.Items[0].createdDate,
                cardId: cardResponse.Items[0].cardId
            };
            return callback(err, planModel);
        }
        else {
            let planModel = {
                id: uuid(),
                createdDate: timeStamp,
                cardId: card.cardId
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

module.exports = {
    createOrGet,
    getById
}