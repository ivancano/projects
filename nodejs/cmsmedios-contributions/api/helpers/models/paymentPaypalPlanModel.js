module.exports = {
    "id": "/paymentPaypalPlanModel",
    "type": "object",
    "properties": {
        "product_id": {
            "type": "string",
            "minLength": 1,
        },
        "name": {
            "type": "string",
            "minLength": 1,
        },
        "description": {
            "type": "string",
            "minLength": 1,
        },
        "billing_cycles": {
            "type": "array",
            "items": {
                "type": "object",
                "items": {
                    "frequency": {
                        "type": "object",
                        "items": {
                            "interval_unit": {
                                "type": "string",
                                "minLength": 1,
                            },
                            "interval_count": {
                                "type": "integer",
                                "minLength": 1,
                            }
                        }
                    },
                    "tenure_type": {
                        "type": "string",
                        "minLength": 1,
                    },
                    "sequence": {
                        "type": "integer",
                        "minLength": 1,
                    },
                    "total_cycles": {
                        "type": "integer",
                        "minLength": 1,
                    },
                    "pricing_scheme": {
                        "type": "object",
                        "items": {
                            "fixed_price": {
                                "type": "object",
                                "items": {
                                    "value": {
                                        "type": "integer",
                                        "minLength": 1,
                                    },
                                    "currency_code": {
                                        "type": "integer",
                                        "minLength": 1,
                                    },
                                }
                            }
                        }
                    }
                }
            }
        },
        "payment_preferences": {
            "type": "object",
            "items": {
                "service_type": {
                    "type": "string",
                    "minLength": 1,
                },
                "auto_bill_outstanding": {
                    "type": "boolean"
                },
                "setup_fee": {
                    "type": "object",
                    "items": {
                        "value": {
                            "type": "string",
                            "minLength": 1,
                        },
                        "currency_code": {
                            "type": "string",
                            "minLength": 1,
                        }
                    }
                },
                "setup_fee_failure_action": {
                    "type": "string",
                    "minLength": 1,
                },
                "payment_failure_threshold": {
                    "type": "integer",
                    "minLength": 1,
                },
            }
        },
        "quantity_supported": {
            "type": "boolean"
        },
        "taxes": {
            "type": "object",
            "items": {
                "percentage": {
                    "type": "string",
                    "minLength": 1,
                },
                "inclusive": {
                    "type": "boolean"
                },
            }
        }
    },
    "additionalProperties": false,
    "required": ["product_id", "name", "billing_cycles", "frequency"]
};