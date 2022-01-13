module.exports = {
    "id": "/simpleBindUser",
    "type": "object",
    "properties": {
        "email": {
            "type": "string",
            "minLength": 1,
        }
    },
    "additionalProperties": false,
    "required": ["email"]
}