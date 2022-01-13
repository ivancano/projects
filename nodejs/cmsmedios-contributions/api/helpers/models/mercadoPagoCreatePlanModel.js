module.exports = {
    "id": "/simpleMercadoPagoCreatePlanModel",
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
        "value": {
            "type": "string",
        },
        "currency": {
            "type": "string",
        }
    },
    "required": ["planCode", "description", "interval", "intervalcount", "value", "currency"],
    "additionalProperties": false
}