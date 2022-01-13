module.exports = {
    "id": "/simpleSubscription",
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
        },
        "paymentMethodId": {
            "type": "string",
            "minLength": 1,
        },
        "username": {
            "type": "string",
            "minLength": 1,
        },
        "anonymus": {
            "type": "boolean"
        },
        "contributionId": {
            "type": "string",
            "minLength": 1,
        },
        "active": {
            "type": "boolean"
        },
        "state": {
            "type": "string",
            "minLength": 1,
        },
        "createdDate": {
            "type": "string"
        },
        "deletedDate": {
            "type": "string"
        },
        "updatedDate": {
            "type": "string"
        }
    },
    "additionalProperties": false,
    "required": ["paymentMethodId", "username", "anonymus", "contributionId", "active", "state"]
}