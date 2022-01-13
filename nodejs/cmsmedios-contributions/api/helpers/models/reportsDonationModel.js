module.exports = {
    "id": "/simpleReportsDonation",
    "type": "object",
    "properties": {
        "dateFrom": {
            "type": "string",
        },
        "dateTo": {
            "type": "string",
        },
        "itemsxpage": {
            "type": "string",
        },
        "lastid": {
            "type": "string",
        }
    },
    "required": ["dateFrom", "dateTo", "itemsxpage"],
    "additionalProperties": false
}