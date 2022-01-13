const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const userRepository = require('./userRepository');
const contributionRepo = require('./contributionRepository');
const paymentsGtwayRepo = require('./paymentGatewaysRepository');

let UsersByPackage = (paramDateSince, paramDateUntil, paramItemsxPage, paramLastID, contributionId, paymentMethodId, callback) => {
    // Bringing all the users
    let promUsers = new Promise((resolve, reject) => {
        userRepository.getAllUsers((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    // Bringing all the contributions
    let promContributions = new Promise((resolve, reject) => {
        contributionRepo.getAllContributions((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });

    });
    // Bringing all the payment methods
    let promPaymentMethods = new Promise((resolve, reject) => {
        paymentsGtwayRepo.getAll((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });

    });

    (async() => {
        await Promise.all([
                promUsers,
                promContributions,
                promPaymentMethods
            ])
            .then(result => {
                allUsers = result[0];
                allContributions = result[1];
                allPaymentMethods = result[2];

                let queryTotalCount = [];
                let items = [];
                let itemsPaginated = [];
                let lastId = [];
                let dataToReturn = [];

                let scanParams = {
                    TableName: process.env.cmsSubscriptions,
                    FilterExpression: '#creationTime between :dateSince and :dateUntil AND #cbId=:cbId AND paymentMethodId=:pmId AND active=:act',
                    ExpressionAttributeNames: {
                        '#creationTime': 'createdDate',
                        '#cbId': 'contributionId'
                    },
                    ExpressionAttributeValues: {
                        ':dateSince': Number(paramDateSince),
                        ':dateUntil': Number(paramDateUntil),
                        ':cbId': contributionId,
                        ':act': true,
                        ':pmId': paymentMethodId
                    },
                };

                return docClient.scan(scanParams, (err, data) => { // This query is just for counting the elements that fullfil the query conditions
                    if (err) {
                        return callback(err, null);
                    } else {
                        queryTotalCount = data.Count;

                        scanParams = {
                            TableName: process.env.cmsSubscriptions,
                            FilterExpression: '#creationTime between :dateSince and :dateUntil AND #cbId=:cbId AND paymentMethodId=:pmId AND active=:act',
                            ExpressionAttributeNames: {
                                '#creationTime': 'createdDate',
                                '#cbId': 'contributionId'
                            },
                            ExpressionAttributeValues: {
                                ':dateSince': Number(paramDateSince),
                                ':dateUntil': Number(paramDateUntil),
                                ':cbId': contributionId,
                                ':act': true,
                                ':pmId': paymentMethodId
                            }
                        };

                        if (paramLastID) {
                            scanParams.ExclusiveStartKey = { 'id': paramLastID };
                        }

                        return docClient.scan(scanParams, (err, data) => {
                            if (err) {
                                return callback(err, null);
                            } else {
                                items = items.concat(data.Items);

                                if (items.length > paramItemsxPage) {
                                    itemsPaginated = items.slice(0, paramItemsxPage);
                                    lastId = items[paramItemsxPage - 1].id;
                                } else {
                                    itemsPaginated = items;
                                    lastId = null;
                                }
                                itemsPaginated.forEach(item => {
                                    try {
                                        tmp = allUsers.filter((value) => {
                                            return value.id == item.userId;
                                        });
                                        item['userName'] = tmp[0].userName;
                                        item['userSurname'] = tmp[0].userSurname;
                                        item['userEmail'] = tmp[0].userEmail;
                                    } catch (error) {}
                                    try {
                                        tmp = allContributions.filter((value) => {
                                            return value.id == item.contributionId;
                                        });
                                        item['contributionType'] = tmp[0].type;
                                        item['contributionAmount'] = tmp[0].amount;
                                        item['contributionDescription'] = tmp[0].description;
                                    } catch (error) {}
                                    try {
                                        tmp = allPaymentMethods.filter((value) => {
                                            return value.id == item.paymentMethodId;
                                        });
                                        item['paymentMethodType'] = tmp[0].type;
                                        item['paymentMethodName'] = tmp[0].name;
                                        item['paymentMethodDescription'] = tmp[0].description;
                                    } catch (error) {}
                                });

                                dataToReturn = { 'TotalCount': queryTotalCount, 'LastReadId': lastId, 'data': itemsPaginated }
                                return callback(null, dataToReturn);
                            }
                        });
                    }
                });
            })
            .catch(error => {
                return callback(error, null);
            })
    })();
}

let UsersUnsubscribedByPackage = (paramDateSince, paramDateUntil, paramItemsxPage, paramLastID, contributionId, callback) => {
    // Bringing all the users
    let promUsers = new Promise((resolve, reject) => {
        userRepository.getAllUsers((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    // Bringing all the contributions
    let promContributions = new Promise((resolve, reject) => {
        contributionRepo.getAllContributions((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });

    });
    // Bringing all the payment methods
    let promPaymentMethods = new Promise((resolve, reject) => {
        paymentsGtwayRepo.getAll((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });

    });

    (async() => {
        await Promise.all([
                promUsers,
                promContributions,
                promPaymentMethods
            ])
            .then(result => {
                allUsers = result[0];
                allContributions = result[1];
                allPaymentMethods = result[2];

                let queryTotalCount = [];
                let items = [];
                let itemsPaginated = [];
                let lastId = [];
                let dataToReturn = [];

                let scanParams = {
                    TableName: process.env.cmsSubscriptions,
                    FilterExpression: '#unsubscribeTime between :dateSince and :dateUntil AND #subscribed = :searchValue AND #cbId=:cbId',
                    ExpressionAttributeNames: {
                        '#unsubscribeTime': 'deletedDate',
                        '#subscribed': 'active',
                        '#cbId': 'contributionId'
                    },
                    ExpressionAttributeValues: {
                        ':dateSince': Number(paramDateSince),
                        ':dateUntil': Number(paramDateUntil),
                        ':searchValue': false,
                        ':cbId': contributionId
                    },
                };

                return docClient.scan(scanParams, (err, data) => { // This query is just for counting the elements that fullfil the query conditions
                    if (err) {
                        return callback(err, null);
                    } else {
                        queryTotalCount = data.Count;

                        scanParams = {
                            TableName: process.env.cmsSubscriptions,
                            FilterExpression: '#unsubscribeTime between :dateSince and :dateUntil AND #subscribed = :searchValue AND #cbId=:cbId',
                            ExpressionAttributeNames: {
                                '#unsubscribeTime': 'deletedDate',
                                '#subscribed': 'active',
                                '#cbId': 'contributionId'
                            },
                            ExpressionAttributeValues: {
                                ':dateSince': Number(paramDateSince),
                                ':dateUntil': Number(paramDateUntil),
                                ':searchValue': false,
                                ':cbId': contributionId
                            },
                        };

                        if (paramLastID) {
                            scanParams.ExclusiveStartKey = { 'id': paramLastID };
                        }

                        return docClient.scan(scanParams, (err, data) => {
                            if (err) {
                                return callback(err, null);
                            } else {
                                items = items.concat(data.Items);

                                if (items.length > paramItemsxPage) {
                                    itemsPaginated = items.slice(0, paramItemsxPage);
                                    lastId = items[paramItemsxPage - 1].id;
                                } else {
                                    itemsPaginated = items;
                                    lastId = null;
                                }
                                itemsPaginated.forEach(item => {
                                    try {
                                        tmp = allUsers.filter((value) => {
                                            return value.id == item.userId;
                                        });
                                        item['userName'] = tmp[0].userName;
                                        item['userSurname'] = tmp[0].userSurname;
                                        item['userEmail'] = tmp[0].userEmail;
                                    } catch (error) {}
                                    try {
                                        tmp = allContributions.filter((value) => {
                                            return value.id == item.contributionId;
                                        });
                                        item['contributionType'] = tmp[0].type;
                                        item['contributionAmount'] = tmp[0].amount;
                                        item['contributionDescription'] = tmp[0].description;
                                    } catch (error) {}
                                    try {
                                        tmp = allPaymentMethods.filter((value) => {
                                            return value.id == item.paymentMethodId;
                                        });
                                        item['paymentMethodType'] = tmp[0].type;
                                        item['paymentMethodName'] = tmp[0].name;
                                        item['paymentMethodDescription'] = tmp[0].description;
                                    } catch (error) {}
                                });

                                dataToReturn = { 'TotalCount': queryTotalCount, 'LastReadId': lastId, 'data': itemsPaginated }
                                return callback(null, dataToReturn);
                            }
                        });
                    }
                });
            })
            .catch(error => {
                return callback(error, null);
            })
    })();
}

let payments = (filters, callback) => {
    let queryTotalCount = [];
    let items = [];
    let itemsPaginated = [];
    let lastId = [];
    let dataToReturn = [];
    let scanParams = {}

    if (filters.contributionId !== '' && filters.contributionId !== undefined) {
        extraparams = ' AND contribuitionId =:cbId';
        scanParams = {
            TableName: process.env.cmsPayments,
            FilterExpression: '#cd between :dateFrom and :dateTo AND contributionId=:cbId',
            ExpressionAttributeNames: {
                '#cd': 'createdDate'
            },
            ExpressionAttributeValues: {
                ':dateFrom': Number(filters.dateFrom),
                ':dateTo': Number(filters.dateTo),
                ':cbId': filters.contributionId
            }
        };
    } else {
        scanParams = {
            TableName: process.env.cmsPayments,
            FilterExpression: '#cd between :dateFrom and :dateTo',
            ExpressionAttributeNames: {
                '#cd': 'createdDate'
            },
            ExpressionAttributeValues: {
                ':dateFrom': Number(filters.dateFrom),
                ':dateTo': Number(filters.dateTo)
            }
        };
    }

    return docClient.scan(scanParams, (err, data) => { // This query is just for counting the elements that fullfil the query conditions
        if (err) {
            return callback(err, null);
        } else {
            queryTotalCount = data.Count;
            if (filters.lastid) {
                scanParams.ExclusiveStartKey = { 'id': filters.lastid };
            }
            return docClient.scan(scanParams, (err, data) => {
                if (err) {
                    return callback(err, null);
                } else {

                    items = items.concat(data.Items);

                    if (items.length > filters.itemsxpage) {
                        itemsPaginated = items.slice(0, filters.itemsxpage);
                        lastId = items[filters.itemsxpage - 1].id;
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
let PaymentsMethods = (callback) => {
    return paymentsGtwayRepo.getAll(callback);
}

module.exports = {
    UsersByPackage,
    UsersUnsubscribedByPackage,
    payments,
    PaymentsMethods
}