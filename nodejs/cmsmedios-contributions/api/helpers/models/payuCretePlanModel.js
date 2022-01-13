module.exports = {
    "id": "/simplePayuCreatePlanModel",
    "type": "object",
    "properties": {
        "planCode": {
            "type": "string",
        },
        "description": {
            "type": "string",
        },
        "interval": {
            "type": "string",
        },
        "intervalcount": {
            "type": "string",
        },
        "maxPaymentsAllowed": {
            "type": "string",
        },
        "paymentAttemptsDelay": {
            "type": "string",
        },
        "value": {
            "type": "string",
        },
        "currency": {
            "type": "string",
        }
    },
    "required": ["planCode", "description", "interval", "intervalcount", "maxPaymentsAllowed", "paymentAttemptsDelay", "value", "currency"],
    "additionalProperties": false
}