const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRepository = require('../dataAccessLayer').repositories.UserRepository;
const userCognito = require('../dataAccessLayer').repositories.UserCognitoRepository;
const exceptionRepository = require('../dataAccessLayer').repositories.ExceptionRepository;
const generator = require('generate-password');
const Validator = require('jsonschema').Validator;
const validateSchema = new Validator();
const httpHandler = require('../helpers/httpHandler');
const loginApi = express();
loginApi.use(cors()); // TODO: Configure CORS for allowed origin(s) only in PROD.
loginApi.use(bodyParser.json());

const autoConfirmUser = false;

loginApi.put('/login/signIn', (req, res) => {
  var signInModel = require('../helpers/models/').userSignIn;
  let user = req.body;
  if (validateSchema.validate(user, signInModel).valid) {
    return userCognito.cognitoRegisterUser(user, (err, data) => {
      if (err) {
        if (err.code === "UsernameExistsException") {
          return userRepository.getByEmail(user.email, (erruser, data) => {
            if (erruser) {
              return httpHandler.handleError(erruser, res);
            }
            if (Object.keys(data.Items).length > 0) {
              err.userStatus = data.Items[0].userStatus;
              return httpHandler.handleError(err, res);
            }
          });
        } else if(err.code === "InvalidParameterException") {
          const errMessage = err.message;
          return exceptionRepository.getException(errMessage, (err, exception) => {
            let errorMsg = {en: errMessage};
            if(exception.length > 0){
              errorMsg = {en: exception[0].en, es: exception[0].es, enCustom: exception[0].enCustom, esCustom: exception[0].esCustom}
            }
            return httpHandler.handleError(errorMsg, res);
          })
        } else if(err.code === "InvalidPasswordException") {
          const errMessage = err.message;
          return exceptionRepository.getException(errMessage, (err, exception) => {
            let errorMsg = {en: errMessage};
            if(exception.length > 0){
              errorMsg = {en: exception[0].en, es: exception[0].es, enCustom: exception[0].enCustom, esCustom: exception[0].esCustom}
            }
            return httpHandler.handleError(errorMsg, res);
          })
        } else {
          return httpHandler.handleError(err, res);
        }
      } else {
        user['userCognitoID'] = data.userSub;
        return userRepository.createUser(user, (err, data) => {
          if (err) {
            return httpHandler.handleError(err, res);
          } else {
            let newUserData = data;

            if (autoConfirmUser === true) {
              userCognito.cognitoConfirmUser(user, (err, data) => {
                if (err) {
                  newUserData['userCognitoConfirmationMsg'] = 'Cognito user creation went OK but an error ocurred when automatic confirmation was triggered.' + err;
                  return httpHandler.handleError(newUserData, res);
                } else {
                  newUserData['userCognitoConfirmationMsg'] = data;
                  return httpHandler.handleSuccess(newUserData, res);
                }
              });
            } else {
              return httpHandler.handleSuccess(data, res);
            }
          }
        });
      }
    });
  } else {
    httpHandler.handleError("Bad Request", res, 400);
  }
});

loginApi.put('/login/bindUser', (req, res) => {
  var model = require('../helpers/models/').userBindUser;
  let user = req.body;
  if (validateSchema.validate(user, model).valid) {
    user.password = generator.generate({
      length: 18,
      numbers: true,
      uppercase: true,
      lowercase: true,
      symbols: true,
      excludeSimilarCharacters: true
    });
    user.password = Buffer.from(user.password).toString('base64');
    return userCognito.cognitoRegisterUser(user, (err, data) => {
      if (err) {
        if (err.code = "UsernameExistsException") {
          return userRepository.getByEmail(user.email, (erruser, data) => {
            if (erruser) {
              return httpHandler.handleError(erruser, res);
            }
            if (Object.keys(data.Items).length > 0) {
              err.userStatus = data.Items[0].userStatus;
              return httpHandler.handleError(err, res);
            }
          });
        } else {
          return httpHandler.handleError(err, res);
        }
      } else {
        user.userCognitoID = data.userSub;
        return userRepository.createUser(user, (err, data) => {
          if (err) {
            return httpHandler.handleError(err, res);
          } else {
            let newUserData = data;
            newUserData.password = user.password;
            if (autoConfirmUser === true) {
              return userCognito.cognitoAdminConfirmUser(user, (err, data) => {
                if (err) {
                  return httpHandler.handleError(err, res);
                } else {
                  return httpHandler.handleSuccess(newUserData, res);
                }
              });
            } else {
              return httpHandler.handleSuccess(newUserData, res);
            }
          }
        });
      }
    });
  } else {
    httpHandler.handleError("Bad Request", res, 400);
  }
});

loginApi.post('/login/confirmUser', (req, res) => {
  //TODO: VALIDATE BODY
  userCognito.cognitoConfirmUser(req.body, (err, data) => {
    if (err) {
      return httpHandler.handleError(err, res);
    } else {
      return httpHandler.handleSuccess(data, res);
    }
  });
});

loginApi.post('/login/:username/forgotPassword', (req, res) => {
  let username = req.params.username;
  userCognito.cognitoForgotPassword(username, (err, data) => {
    if (err) {
      return httpHandler.handleError(err, res);
    } else {
      return httpHandler.handleSuccess(data, res);
    }
  });
});

loginApi.post('/login/confirmForgotPassword', (req, res) => {
  let user = req.body;
  userCognito.cognitoConfirmForgotPassword(user, (err, data) => {
    if (err) {
      return httpHandler.handleError(err, res);
    } else {
      return httpHandler.handleSuccess(data, res);
    }
  });
});


loginApi.post('/login/logIn', (req, res) => {
  var model = require('../helpers/models/').userLogin;
  let user = req.body;
  if (validateSchema.validate(user, model).valid) {
    userCognito.cognitoLogin(user, (err, data) => {
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

loginApi.post('/login/verifyEmail', (req, res) => {
  let accessToken = req.body.AccessToken;
  let code = req.body.code
  userCognito.cognitoVerifyEmail(code, accessToken, (err, data) => {
    if (err) {
      return httpHandler.handleError(err, res);
    } else {
      return httpHandler.handleSuccess(data, res);
    }
  });
});

loginApi.post('/login/resendVerificationCode', (req, res) => {
  return userCognito.cognitoReSendVerificationCode(req.body.username, (err, data) => {
    if (err) {
      return httpHandler.handleError(err, res);
    } else {
      return httpHandler.handleSuccess(data, res);
    }
  });
});

module.exports = {
  loginApi
};