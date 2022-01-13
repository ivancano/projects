module.exports = {
    "id": "/simpleUserDelete",
    "type": "object",
    "properties": {
        "username": {
            "type": "string",
            "minLength": 1,
        }
    },
    "additionalProperties": false,
    "required": ["username"]
}