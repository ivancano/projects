module.exports = {
    "id": "/simpleReportsPaymentsByPackage",
    "type": "object",
    "properties": {
        "dateFrom": {
            "type": "string",
        },
        "dateTo": {
            "type": "string",
        },
        "contributionId": {
            "type": "string",
        },
        "itemsxpage": {
            "type": "string",
        },
        "lastid": {
            "type": "string",
        }
    },
    "required": ["dateFrom", "dateTo", "contributionId", "itemsxpage"],
    "additionalProperties": false
}