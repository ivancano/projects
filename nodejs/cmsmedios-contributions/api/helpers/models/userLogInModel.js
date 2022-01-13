module.exports = {
    "id": "/simpleLogin",
    "type": "object",
    "properties": {
        "username": {
            "type": "string",
            "minLength": 1,
        },
        "password": {
            "type": "string",
            "minLength": 1,
        }
    },
    "additionalProperties": false,
    "required": ["username", "password"]
}