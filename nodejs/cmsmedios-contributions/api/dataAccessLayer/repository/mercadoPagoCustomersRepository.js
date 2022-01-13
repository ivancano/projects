var AWS = require("aws-sdk");
var uuid = require("uuid/v4");
var table = process.env.cmsMercadoPagoCustomers;

let createOrUpdate = (customer, callback) => {
    let timeStamp = Date.now();
    var docClient = new AWS.DynamoDB.DocumentClient();
    let scanParams = {
        TableName: table,
        FilterExpression: 'customerId = :cid',
        ExpressionAttributeValues: {
            ':cid': customer.customer_id
        },
    };

    return docClient.scan(scanParams, (err, customerResponse) => {
        if(err) return callback(err);
        if(customerResponse.Items.length > 0){
            var currentCards = customerResponse.Items[0].cards;
            if(!currentCards.includes(customer.card)){
                currentCards.push(customer.card);
            }
            var params = {
                TableName: table,
                Key: {
                    'id': customerResponse.Items[0].id
                },
                UpdateExpression: 'SET cards=:c',
                ExpressionAttributeValues: {
                    ':c': currentCards
                },
                ReturnValues: 'UPDATED_NEW'
            };

            return docClient.update(params, (err) => {
                return callback(err, customerResponse.Items[0]);
            });
        }
        else {
            let planModel = {
                id: uuid(),
                createdDate: timeStamp,
                customerId: customer.customer_id,
                cards: [customer.card]
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
    createOrUpdate,
    addCard
}