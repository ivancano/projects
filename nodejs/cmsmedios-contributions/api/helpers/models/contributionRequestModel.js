module.exports = {
    "id": "/simpleContribution",
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
        "type": {
            "type": "string",
            "minLength": 1,
        },
        "amount": {
            "type": "string",
            "minLength": 1,
        },
        "frequency": {
            "type": "string",
            "minLength": 1,
        },
        "state": {
            "type": "string",
            "minLength": 1,
        },
        "description": {
            "type": "string",
            "minLength": 1,
        },
        "image": {
            "type": "string",
            "minLength": 1,
        },
        "paymentMethods": {
            "type": "array",
            "items": {
                "type": "object",
                "items": {
                    "PaymentMethodId": {
                        "type": "string",
                        "minLength": 1,
                    },
                    "planId": {
                        "type": "string",
                        "minLength": 1,
                    },
                }
            }
        }
    },
    "additionalProperties": false,
    "required": ["name", "type", "amount", "state", "paymentMethods"]
};