const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRepository = require('../dataAccessLayer').repositories.UserRepository;
const userCognito = require('../dataAccessLayer').repositories.UserCognitoRepository;
const serfinsaCustomersRepository = require('../dataAccessLayer/repository/serfinsaCustomersRepository');
const serfinsaCardsRepository = require('../dataAccessLayer/repository/serfinsaCardsRepository');
const serfinsaService = require('../paymentMethods').serfinsa;
const subscriptionRepository = require('../dataAccessLayer').repositories.SubscriptionRepository
const validateToken = require('../helpers').repositories.ValidateToken;
const Validator = require('jsonschema').Validator;
const httpHandler = require('../helpers/httpHandler');
var validateSchema = new Validator();

const usersApi = express();
usersApi.use(cors()); // TODO: Configure CORS for allowed origin(s) only in PROD.
usersApi.use(bodyParser.json());

const autoConfirmUser = true;

usersApi.delete('/users/deleteUser', (req, res) => {
    var model = require('../helpers/models/').userDelete;
    let user = req.body;
    if (validateSchema.validate(user, model).valid) {
        return userCognito.cognitoGetUserID(user, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            } else {
                let userIDToDelete = { 'userCognitoID': data.userid };
                return userCognito.cognitoDeleteUser(user, (err, data) => {
                    if (err) {
                        return httpHandler.handleError(err, res);
                    } else {
                        return userRepository.deleteUser(userIDToDelete, (err, data) => {
                            if (err) {
                                return httpHandler.handleError(err, res);
                            } else {
                                return httpHandler.handleSuccess(data, res);
                            }
                        });
                    }
                });
            }
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

usersApi.put('/users/changePassword', (req, res) => {
    var model = require('../helpers/models/').userChangePassword;
    let user = req.body;
    if (validateSchema.validate(user, model).valid) {
        return userCognito.cognitoChangePassword(user, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            } else {
                return httpHandler.handleSuccess(data, res);
            }
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

usersApi.get('/users/getUserProfile', (req, res) => {
    return userCognito.cognitoUserProfile(req.query.accessToken, (err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else {
            let userCognitoData = data;
            return userRepository.getById(userCognitoData.UserAttributes[0].Value, (err, data) => {
                if (err) {
                    return httpHandler.handleError(err, res);
                } else {
                    userCognitoData['userExtraData'] = data;
                    return httpHandler.handleSuccess(userCognitoData, res);
                }
            });
        }
    });
});

usersApi.put('/users/updateUserProfile', (req, res) => {
    var model = require('../helpers/models/').userUpdateProfile;
    let user = req.body;
    if (validateSchema.validate(user, model).valid) {
        return userRepository.getById(user.id, (err, data) => {

            if (data.length == 0)
                return httpHandler.handleError("user not found", res, 404);
            if (err) {
                return httpHandler.handleError(err, res);
            } else {
                console.log("here");
                return userRepository.updateUser(user, (err, data) => {
                    if (err) {
                        return httpHandler.handleError(err, res);
                    } else {
                        return httpHandler.handleSuccess(data, res);
                    }
                });
            }
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

usersApi.get('/users/:userId/GetUser', (req, res) => {
    return userRepository.getById(req.params.userId, (err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else {
            return httpHandler.handleSuccess(data, res);
        }
    });
});

usersApi.get('/users/getRegisterUsers', (req, res) => {
    var model = require('../helpers/models').userGetRegisterUsers;
    let filters = req.query;
    if (validateSchema.validate(filters, model).valid) {
        return userRepository.getUsersByDate(filters.dateFrom, filters.dateTo, filters.itemsxpage, filters.lastid, (err, data) => {
            if (err) {
                return httpHandler.handleError(err, res);
            } else {
                return httpHandler.handleSuccess(data, res);
            }
        });
    } else {
        httpHandler.handleError("Bad Request", res, 400);
    }
});

usersApi.post('/users/validateToken', (req, res) => {
    let token = req.body;
    return validateToken(token.data, (err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else {
            return httpHandler.handleSuccess("Valid token.", res);
        }
    });
});

usersApi.post('/users/admin/resetUserPassword', (req, res) => {
    let username = req.body.username;
    userCognito.cognitoResetUserPassword(username, (err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else {
            return httpHandler.handleSuccess(data, res);
        }
    });
});

usersApi.get('/users/admin/:username/GetUserStatus', (req, res) => {
    return userCognito.cognitoGetUserStatus(req.params.username, (err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else {
            return httpHandler.handleSuccess(data, res);
        }
    });
});

usersApi.get('/users/getSerfinsaCards', (req, res) => {
    return userCognito.cognitoUserProfile(req.query.accessToken, (err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else {
            let userCognitoData = data;
            serfinsaCustomersRepository.getCustomerByUserId(userCognitoData.UserAttributes[0].Value, (err, customer) => {
                if(err) return httpHandler.handleError(err, res);
                if(customer.length > 0){
                    serfinsaCardsRepository.getFiltered({customerId: customer[0].id}, (err, cards) => {
                        if(err) return httpHandler.handleError(err, res);
                        return httpHandler.handleSuccess(cards, res);
                    });
                }
                else {
                    return httpHandler.handleError("Customer not found", res);
                }
            });
        }
    });
});

usersApi.post('/users/deleteSerfinsaCard', (req, res) => {
    let cardFound = false;
    return userCognito.cognitoUserProfile(req.query.accessToken, (err, data) => {
        if (err) {
            return httpHandler.handleError(err, res);
        } else {
            let userCognitoData = data;
            serfinsaCustomersRepository.getCustomerByUserId(userCognitoData.UserAttributes[0].Value, (err, customer) => {
                if(err) return httpHandler.handleError(err, res);
                if(customer.length > 0){
                    serfinsaCardsRepository.getFiltered({customerId: customer[0].id}, (err, cards) => {
                        if(err) return httpHandler.handleError(err, res);
                        for (let index = 0; index < cards.length; index++) {
                            const card = cards[index];
                            if(card.token === req.body.token){
                                cardFound = card;
                            }
                        }
                        if(cardFound !== false){
                            subscriptionRepository.getFiltered({cardIdSerfinsa: cardFound.id, state: "ACTIVE"}, (err, subscriptions) => {
                                if(err) return httpHandler.handleError(err, res);
                                console.log(subscriptions);
                                if(subscriptions.length === 0){
                                    serfinsaService.deleteCustomerSerfinsa({
                                        key: req.body.token
                                    }).then(data => {
                                        console.log(data);
                                        if(data === true){
                                            serfinsaCardsRepository.deleteCard(cardFound.id, (err, cardDeteled) => {
                                                if(err) return httpHandler.handleError(err, res, 400);
                                                return httpHandler.handleSuccess(cardFound, res);
                                            });
                                        }
                                        else {
                                            return httpHandler.handleError("Error trying to delete the card", res, 400);
                                        }
                                    }).catch(err => {
                                        return httpHandler.handleError(err, res, 400);
                                    })
                                }
                                else {
                                    return httpHandler.handleError("This card is associated with an active subscription", res, 400);
                                }
                            });
                        }
                        else {
                            return httpHandler.handleError("Card not found", res, 400);
                        }
                    });
                }
                else {
                    return httpHandler.handleError("Customer not found", res);
                }
            });
        }
    });
});

module.exports = {
    usersApi
};