module.exports = {
    "id": "/simplePayuWebCheckoutModel",
    "type": "object",
    "properties": {
        "amount": {
            "type": "string",
        },
        "description": {
            "type": "string",
        },
        "referenceCode": {
            "type": "string",
        },
        "tax": {
            "type": "string",
        },
        "currency": {
            "type": "string",
        }
    },
    "required": ["amount", "description", "referenceCode", "tax", "currency"],
    "additionalProperties": false
}