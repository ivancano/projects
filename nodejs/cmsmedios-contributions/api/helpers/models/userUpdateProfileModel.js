module.exports = {
    "id": "/simpleUserUpdateProfile",
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "minLength": 1,
        },
        "name": {
            "type": "string",
            "minLength": 1,
        },
        "surname": {
            "type": "string",
            "minLength": 1,
        },

        "idnumber": {
            "type": "string",
            "minLength": 1,
        },
        "status": {
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
    "required": ["id"]
}