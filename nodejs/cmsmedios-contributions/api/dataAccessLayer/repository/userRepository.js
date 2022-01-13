const uuidv4 = require('uuid/v4');
var AWS = require("aws-sdk");
var table = process.env.cmsUsers;
const docClient = new AWS.DynamoDB.DocumentClient();

let createUser = (user, callback) => {
    let timeStamp = Date.now();
    // In this case the ID comes from "outside" and it should be the SUB from Cognito
    let new_item = {
        'id': user.userCognitoID,
        'userName': user.name,
        'userSurname': user.surname,
        'userEmail': user.email,
        'userId': user.idnumber,
        'userCreationTime': timeStamp,
        'userLastModifiedTime': 0,
        'userDeletionTime': 0,
        'userStatus': 'CREATED',
        'userExternalReference': user.externalreference,
        'userInternal': 0,
        'userCustomData': user.customdata
    };
    let params = {
        TableName: table,
        Item: new_item,
        ReturnValues: 'ALL_OLD'
    };
    docClient.put(params, (err, data) => {
        return callback(err, new_item);
    });
}

let createInternalUser = (user, callback) => {
    let timeStamp = Date.now();
    let id = uuidv4();
    let new_item = {
        'id': id,
        'userEmail': user.email,
        'userCreationTime': timeStamp,
        'userLastModifiedTime': 0,
        'userDeletionTime': 0,
        'userStatus': 'CREATED',
        'userInternal': 1
    };
    let params = {
        TableName: table,
        Item: new_item,
        ReturnValues: 'ALL_OLD'
    };
    docClient.put(params, (err, data) => {
        return callback(err, new_item);
    });
}

let updateUser = (user, callback) => {
    let timeStamp = Date.now();
    let params = {
        TableName: table,
        Key: {
            'id': user.id
        },
        UpdateExpression: 'SET userName=:u, userSurname=:s, userId=:i, userLastModifiedTime=:d, userStatus=:a, userExternalReference=:e, userCustomData=:c',
        ExpressionAttributeValues: {
            ':u': user.name,
            ':s': user.surname,
            ':i': user.idnumber,
            ':d': timeStamp,
            ':a': user.status,
            ':e': user.externalreference,
            ':c': user.customdata
        },
        ReturnValues: 'UPDATED_NEW'
    };
    return docClient.update(params, callback);
}

let confirmUser = (userId, callback) => {
    let timeStamp = Date.now();
    let params = {
        TableName: table,
        Key: {
            'id': userId
        },
        UpdateExpression: 'SET userStatus=:a, userLastModifiedTime=:d',
        ExpressionAttributeValues: {
            ':a': 'ACTIVE',
            ':d': timeStamp
        },
        ReturnValues: 'UPDATED_NEW'
    };
    return docClient.update(params, callback);
}

let deleteUser = (user, callback) => {
    console.log(user);
    // This really deactivate the user. Does not delete the item from Dynamo
    let timeStamp = Date.now();
    let params = {
        TableName: table,
        Key: {
            'id': user.userCognitoID
        },
        UpdateExpression: 'SET userStatus=:a, userDeletionTime=:d',
        ExpressionAttributeValues: {
            ':a': 'INACTIVE',
            ':d': timeStamp
        },
        ReturnValues: 'UPDATED_NEW'
    };
    return docClient.update(params, callback);
}

let getById = (id, callback) => {
    // Search for an user within all users returned from getAllUsers
    let tmp = [];
    return getAllUsers((err, data) => {
        if (err) {
            return callback(err, null);
        } else {
            tmp = data.filter((value) => {
                return value.id == id;
            });
            return callback(null, tmp);
        }
    });
}

let getUsersByDate = (paramDateSince, paramDateUntil, paramItemsxPage, paramLastID, callback) => {
    let queryTotalCount = [];
    let items = [];
    let itemsPaginated = [];
    let lastId = [];
    let dataToReturn = [];
    let scanParams = {
        TableName: table,
        FilterExpression: '#CreationTime between :dateSince and :dateUntil',
        ExpressionAttributeNames: {
            '#CreationTime': 'userCreationTime'
        },
        ExpressionAttributeValues: {
            ':dateSince': Number(paramDateSince),
            ':dateUntil': Number(paramDateUntil)
        },
    };
    return docClient.scan(scanParams, (err, data) => { // This query is just for counting the elements that fullfil the query conditions
        if (err) {
            return callback(err, null);
        } else {
            queryTotalCount = data.Count;
            scanParams = {
                TableName: table,
                FilterExpression: '#CreationTime between :dateSince and :dateUntil',
                ExpressionAttributeNames: {
                    '#CreationTime': 'userCreationTime'
                },
                ExpressionAttributeValues: {
                    ':dateSince': Number(paramDateSince),
                    ':dateUntil': Number(paramDateUntil)
                }
            };
            if (paramLastID) {
                scanParams.ExclusiveStartKey = { 'id': paramItemsxPage };
            }
            return docClient.scan(scanParams, (err, data) => {
                if (err) {
                    return callback(err, null);
                } else {
                    items = items.concat(data.Items);
                    if (items.length > paramItemsxPage) {
                        itemsPaginated = items.slice(0, paramItemsxPage);
                        lastId = items[paramItemsxPage].id;
                    } else {
                        itemsPaginated = items;
                        lastId = null;
                    }
                    dataToReturn = { 'TotalCount': queryTotalCount, 'LastReadId': lastId, 'data': itemsPaginated }
                    return callback(null, dataToReturn);
                }
            });
        }
    });
}

let getAllUsers = (callback) => {
    // Brings all the users from Dynamo at once.
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

let getByEmail = (email, callback) => {
    const docClient = new AWS.DynamoDB.DocumentClient();
    let scanParams = {
        TableName: table,
        FilterExpression: '#Mail = :email',
        ExpressionAttributeNames: {
            '#Mail': 'userEmail'
        },
        ExpressionAttributeValues: {
            ':email': email
        },
    };
    return docClient.scan(scanParams, callback);
}

module.exports = {
    confirmUser,
    createUser,
    createInternalUser,
    updateUser,
    deleteUser,
    getById,
    getUsersByDate,
    getAllUsers,
    getByEmail
}