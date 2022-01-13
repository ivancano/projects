module.exports = {
    "id": "/simpleUserChangePassword",
    "type": "object",
    "properties": {
        "accessToken": {
            "type": "string",
            "minLength": 1,
        },
        "password": {
            "type": "string",
            "minLength": 1,
        },
        "newpassword": {
            "type": "string",
            "minLength": 1,
        }
    },
    "additionalProperties": false,
    "required": ["accessToken", "password", "newpassword"]
}