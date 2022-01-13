module.exports = {
    "id": "/simpleGetRegisterUsersModel",
    "type": "object",
    "properties": {
        "dateFrom": {
            "type": "string",
            "minLength": 1,
        },
        "dateTo": {
            "type": "string",
            "minLength": 1,
        },
        "itemsxpage": {
            "type": "string",
            "minLength": 1,
        },
        "lastid": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": ["dateFrom", "dateTo", "itemsxpage"]
}