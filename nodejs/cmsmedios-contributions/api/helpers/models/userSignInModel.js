module.exports = {
    "id": "/simpleUserSignIn",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1,
        },
        "surname": {
            "type": "string",
            "minLength": 1,
        },
        "email": {
            "type": "string",
            "minLength": 1,
        },
        "password": {
            "type": "string",
            "minLength": 1,
        },
        "idnumber": {
            "type": "string",
            "minLength": 1,
        },
        "externalreference": {
            "type": "string",
            "minLength": 1,
        },
        "customdata": {
            "type": "object"
        }
    },
    "additionalProperties": false,
    "required": ["name", "surname", "email", "password", "idnumber"]
}