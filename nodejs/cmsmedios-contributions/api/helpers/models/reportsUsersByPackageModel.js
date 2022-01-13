module.exports = {
    "id": "/simpleUsersByPackage",
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
        "contributionId": {
            "type": "string",
            "minLength": 1,
        },
        "paymentMethodId": {
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
    "required": ["dateFrom", "dateTo", "contributionId", "paymentMethodId", "itemsxpage"]
}