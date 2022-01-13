const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
const userRepository = require('./userRepository');
global.fetch = require('node-fetch'); // Importing node-fetch to global.fetch is because of amazon-cognito-identity-js package is a javascript library meant for web browser and it uses fetch in library. Since nodejs don’t have fetch in built we have to emulate it like that.

const poolData = {
    UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID, //process.env.AWS_COGNITO_USERPOOL_ID,
    ClientId: process.env.AWS_COGNITO_CLIENT_ID //process.env.AWS_COGNITO_CLIENT_ID
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

let cognitoRegisterUser = (user, callback) => {
    let buffCodedPassword = new Buffer(user.password, 'base64'); // It is assumed password comes Base64 encoded
    let tmppass = buffCodedPassword.toString('ascii');
    let attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: user.email }));
    return userPool.signUp(user.email, tmppass, attributeList, null, callback);
}

let cognitoAdminConfirmUser = (user, callback) => {
    // By default Cognito let a registered user in an unconfirmed status. This function forces user confirmation.
    let confirmParams = {
        UserPoolId: poolData.UserPoolId,
        Username: user.email

    };
    return cognitoidentityserviceprovider.adminConfirmSignUp(confirmParams, (err, data) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, 'The user has been succesfully confirmed.');
        }
    });
}

let cognitoConfirmUser = (user, callback) => {
    // By default Cognito let a registered user in an unconfirmed status. This function forces user confirmation.
    let confirmParams = {
        ClientId: poolData.ClientId,
        ConfirmationCode: user.code,
        Username: user.username
    };
    return cognitoidentityserviceprovider.confirmSignUp(confirmParams, (err, data) => {
        if (err) {
            return callback(err, null);
        } else {
            return userRepository.getByEmail(user.username, (err, data) => {
                if (err) {
                    return callback(err, null);
                } else {
                    return userRepository.confirmUser(data.Items[0].id, (err, data) => {
                        if (err) {
                            return callback(err, null);
                        } else {
                            return callback(null, 'The user has been succesfully confirmed.');
                        }
                    })
                }
            })

        }
    });
}

let cognitoConfirmForgotPassword = (user, callback) => {
    let buffCodedPassword = new Buffer(user.password, 'base64');
    let confirmParams = {
        ClientId: poolData.ClientId,
        Username: user.username,
        ConfirmationCode: user.code,
        Password: buffCodedPassword.toString('ascii')
    };
    return cognitoidentityserviceprovider.confirmForgotPassword(confirmParams, (err, data) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, data);
        }
    });
}

let cognitoForgotPassword = (username, callback) => {
    let confirmParams = {
        ClientId: poolData.ClientId,
        Username: username
    };
    return cognitoidentityserviceprovider.forgotPassword(confirmParams, (err, data) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, data);
        }
    });
}

let cognitoLogin = (user, callback) => {
    let buffCodedPassword = new Buffer(user.password, 'base64'); // It is assumed password comes Base64 encoded
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: user.username,
        Password: buffCodedPassword.toString('ascii') // Se pasa el pass a ascii
    });
    let userData = {
        Username: user.username,
        Pool: userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            let tokens = {
                idToken: result.getIdToken().getJwtToken(),
                AccessToken: result.getAccessToken().getJwtToken()
            }
            return callback(null, tokens); // Por ahora solo se devuelve el access token.
        },
        onFailure: function(err) {
            return callback(err, null);
        },
    });
}

let cognitoGetUserID = (user, callback) => {
    const params = {
        UserPoolId: poolData.UserPoolId,
        Username: user.username
    };
    return cognitoidentityserviceprovider.adminGetUser(params, (err, data) => {
        if (err) {
            return callback(err, null);
        } else {
            let userID = { "userid": data.Username };
            return callback(null, userID);
        }
    });
}

let cognitoDeleteUser = (user, callback) => {
    // This function really deletes the user from Cognito leaving no trace of the deleted user.
    let userData = {
        Username: user.username,
        UserPoolId: poolData.UserPoolId
    };
    return cognitoidentityserviceprovider.adminDeleteUser(userData, function(err, data) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, data);
        }
    });
}

let cognitoChangePassword = (user, callback) => {
    let buffCodedPassword = new Buffer(user.password, 'base64'); // It is assumed password comes Base64 encoded
    let buffCodedNewPassword = new Buffer(user.newpassword, 'base64'); // It is assumed password comes Base64 encoded
    let params = {
        AccessToken: user.accessToken,
        PreviousPassword: buffCodedPassword.toString('ascii'),
        ProposedPassword: buffCodedNewPassword.toString('ascii')
    };
    return cognitoidentityserviceprovider.changePassword(params, function(err, data) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, data);
        }
    });
}

let cognitoUserProfile = (token, callback) => {
    let params = {
        AccessToken: token
    };
    return cognitoidentityserviceprovider.getUser(params, (err, data) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, data);
        }
    });
}

let cognitoVerifyEmail = (code, token, callback) => {
    let params = {
        AccessToken: token,
        AttributeName: 'email',
        Code: code
    };
    return cognitoidentityserviceprovider.verifyUserAttribute(params, (err, data) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, data);
        }
    });
}

let cognitoReSendVerificationCode = (username, callback) => {
    let params = {
        ClientId: poolData.ClientId,
        Username: username
    };
    return cognitoidentityserviceprovider.resendConfirmationCode(params, (err, data) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, data);
        }
    });
}

let cognitoResetUserPassword = (username, callback) => {
    const params = {
        UserPoolId: poolData.UserPoolId,
        Username: username
    };
    return cognitoidentityserviceprovider.adminResetUserPassword(params, (err, data) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, data);
        }
    });
}

let cognitoGetUserStatus = (username, callback) => {
    const params = {
        UserPoolId: poolData.UserPoolId,
        Username: username
    };
    return cognitoidentityserviceprovider.adminGetUser(params, (err, data) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, data);
        }
    });
}

module.exports = {
    cognitoRegisterUser,
    cognitoAdminConfirmUser,
    cognitoLogin,
    cognitoGetUserID,
    cognitoDeleteUser,
    cognitoChangePassword,
    cognitoUserProfile,
    cognitoForgotPassword,
    cognitoVerifyEmail,
    cognitoConfirmForgotPassword,
    cognitoConfirmUser,
    cognitoReSendVerificationCode,
    cognitoResetUserPassword,
    cognitoGetUserStatus
}