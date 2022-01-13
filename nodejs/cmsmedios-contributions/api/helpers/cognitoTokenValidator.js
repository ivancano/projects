const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch'); // Importing node-fetch to global.fetch is because of amazon-cognito-identity-js package is a javascript library meant for web browser and it uses fetch in library. Since nodejs don’t have fetch in built we have to emulate it like that.

const poolData = {
    UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID,
    ClientId: process.env.AWS_COGNITO_CLIENT_ID
};

const pool_region = process.env.AWS_REGION;

function ValidateToken(token, callback) {
    request({
        url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            pems = {};
            var keys = body['keys'];
            for (var i = 0; i < keys.length; i++) {
                //Convert each key to PEM
                var key_id = keys[i].kid;
                var modulus = keys[i].n;
                var exponent = keys[i].e;
                var key_type = keys[i].kty;
                var jwk = { kty: key_type, n: modulus, e: exponent };
                var pem = jwkToPem(jwk);
                pems[key_id] = pem;
            }
            //validate the token
            var decodedJwt = jwt.decode(token, { complete: true });
            if (!decodedJwt) {
                return callback("Not a valid JWT token", null);
            }

            var kid = decodedJwt.header.kid;
            var pem = pems[kid];
            if (!pem) {
                return callback("Invalid token", null);
            }

            jwt.verify(token, pem, function(err, payload) {
                if (err) {
                    return callback(err, null)
                } else {
                    return callback(null, payload)
                }
            });
        } else {
            callback("Error! Unable to download JWKs", null);
        }
    });
}

module.exports = {
    ValidateToken
}