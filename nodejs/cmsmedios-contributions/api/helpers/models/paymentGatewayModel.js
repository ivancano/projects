module.exports = {
    "id": "/simpleGateway",
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "minLength": 1,
        },

        "name": {
            "type": "string",
            "minLength": 1
        },
        "description": {
            "type": "string",
            "minLength": 1
        },
        "type": {
            "type": "string",
            "minLength": 1
        },
        "webhook": {
            "type": "string",
            "minLength": 1
        },
        "createdDate": {
            "type": "integer",
            "minLength": 1
        }
    },
    "additionalProperties": false,
    "required": ["id", "name", "type", "webhook"]
}