import requests
from requests.auth import HTTPBasicAuth
import logging
import json


class ServiceNow:
    def __init__(self, config):
        self.config = config

    def getSource(self):
        return self.config["source"]

    def sendAlert(self, alert):
        logging.debug(f"Sending Event with Alert_id {alert['Alert_id']} to ServiceNow")
        result = False
        try:
            response = requests.post(
                self.config["url"],
                data=json.dumps(alert),
                auth=HTTPBasicAuth(
                    self.config["auth"]["user"], self.config["auth"]["pass"]
                ),
            )

            logging.debug(f"payload to ServiceNow: {json.dumps(alert)}")
            logging.debug(
                f"Response of ServiceNow for Alert_id: {alert['Alert_id']} : {response}"
            )

            if response.status_code in range(200, 230):
                result = True
            else:
                logging.warning(f"Unable to send alert to ServiceNow alert {alert['Alert_id']} status {response.status_code}")

        except Exception as e:
            logging.error(f"alert {alert['Alert_id']} failed to be sent to ServiceNow. Reason : {e}")

        return result


class MockServiceNow:
    def __init__(self, config):
        self.config = config

    def getSource(self):
        return self.config["source"]

    def sendAlert(self, alert):
        logging.debug(f"Sending Event with Alert_id {alert['Alert_id']} to ServiceNow")
        result = True

        return result

