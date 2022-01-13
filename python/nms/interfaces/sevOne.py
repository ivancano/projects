import requests
import logging
import json
import sys

class SevOne:
    def __init__(self, config):
        self.config = config

    def getSource(self):
        return self.config["source"]

    def getAlertList(self, currentTimestamp, closed):
        logging.info(f"Requesting Alerts from SevOne closed {closed}")
        alerts = []
        try:
            if (closed): 
                timeWindow  = self.config["timeWindowClosedAlerts"] # seconds
            else:
                timeWindow  = self.config["timeWindow"] # seconds
                
            pageSize = self.config["pageSize"]
            pageNumber = 0
            maxPageCount = sys.maxsize
            while pageNumber < maxPageCount:
                payload = {
                    "includeCount": int(False),
                    "closed" : int(closed),
                    "timespanBetween": {
                        "startTime": (currentTimestamp - timeWindow) * 1000,
                        "endTime": currentTimestamp * 1000,
                    },
                }
                logging.debug(f"Payload Request to SevOne {payload}")
                # Requesting alerts from SEVONE
                response = requests.post(
                    self.config["url"] + f"?page={pageNumber}&size={pageSize}",
                    data=json.dumps(payload),
                    headers=self.config["headers"],
                )

                response = json.loads(response.content)
                logging.debug("Response from SevOne")
                logging.debug(response)
                maxPageCount = int(response["totalPages"])
                pageNumber = int(response["pageNumber"]) + 1
                tempList = response["content"]
                alerts = alerts + tempList

            logging.info(f"Finishing request to SevOne closed {closed}")
        except Exception as e:
            logging.error(f"Failed to fetch Alerts from SevOne closed {closed}. Reason : {e}")

        return alerts

    def clearAlert(self, alertid):
        logging.info("Clearing Alerts into SevOne")
        try:
            payload = {
                        "message": "issue is cleared by sevone"
                    }
            urlClear =  self.config['urlClear']
            urlClear  = urlClear.replace("--alert-id--",str(alertid))
            response = requests.patch(urlClear,
                            data=json.dumps(payload),
                            headers=self.config['headers'])            
            logging.debug(f"Payload Clear to SevOne {payload} url {urlClear}")
            logging.debug(f"Response from SevOne {response.status_code}")
            if int(response.status_code) in range(200,231):
                logging.info(f"Alert {alertid} cleared in SevOne")
                return True
            else:
                logging.warning(f"Alert {alertid} not cleared in SevOne response code {response.status_code}")
                return False
        except Exception as e:
            logging.error(f"Failed to clear Alerts from SevOne. Reason : {e}")
            return False

class MockSevOne:
    def __init__(self, config):
        self.config = config

    def getSource(self):
        return self.config["source"]
    
    def clearAlert(self, alertid):
        logging.info(f"Clearing Alerts into SevOne {alertid}")
        return True

    
    def getAlertList(self, currentTimestamp, closed):
        logging.info(f"Requesting Alerts from SevOne {closed}")
        if closed:
            alerts = [
                {
                    "thresholdName": None,
                    "policyName": None,
                    "objectName": None,
                    "indicatorName": None,
                    "id": 32,
                    "severity": 4,
                    "origin": "system",
                    "deviceId": 384,
                    "pluginName": "KANKEI_NAI",
                    "objectId": 34154,
                    "pollId": -1,
                    "startTime": 1623690903000,
                    "endTime": 1623748142000,
                    "clearTime": 0,
                    "message": 'Threshold triggered -- LAN_SEVONE -- "WiFi AP:APDario2 -- CPU7 -- CPU 5 Minute Average" > 3 Percent Average in 5.00 minutes',
                    "number": 319,
                    "ignoreUntil": 0,
                    "ignoreUid": -1,
                    "ignoreComment": None,
                    "thresholdId": 111423,
                    "alertFlowFalcon": None,
                    "closed": 1,
                    "closedKey": 0,
                    "indicatorId": -1,
                    "assignedTo": -1,
                    "comments": "",
                    "clearMessage": "",
                    "acknowledgedBy": "",
                    "lastProcessed": 0,
                    "isMaintenanceAlert": False,
                },
                {
                    "thresholdName": None,
                    "policyName": None,
                    "objectName": None,
                    "indicatorName": None,
                    "id": 400,
                    "severity": 6,
                    "origin": "system",
                    "deviceId": 384,
                    "pluginName": "KANKEI_NAI",
                    "objectId": 34154,
                    "pollId": -1,
                    "startTime": 1623690903000,
                    "endTime": 1623748142000,
                    "clearTime": 0,
                    "message": 'Threshold triggered -- LAN_SEVONE -- "IgnoreSev out -- CPU7 -- CPU 5 Minute Average" > 3 Percent Average in 5.00 minutes',
                    "number": 319,
                    "ignoreUntil": 0,
                    "ignoreUid": -1,
                    "ignoreComment": None,
                    "thresholdId": 111423,
                    "alertFlowFalcon": None,
                    "closed": 1,
                    "closedKey": 0,
                    "indicatorId": -1,
                    "assignedTo": -1,
                    "comments": "",
                    "clearMessage": "",
                    "acknowledgedBy": "",
                    "lastProcessed": 0,
                    "isMaintenanceAlert": False,
                },
                { 
                    "thresholdName": None,
                    "policyName": None,
                    "objectName": None,
                    "indicatorName": None,
                    "id": 401,
                    "severity": 4,
                    "origin": "system",
                    "deviceId": 384,
                    "pluginName": "KANKEI_NAI",
                    "objectId": 34154,
                    "pollId": -1,
                    "startTime": 1623690903000,
                    "endTime": 1623748142000,
                    "clearTime": 0,
                    "message": 'Threshold triggered -- LAN_SEVONE -- "IgnoreAutoClearSNOW -- CPU7 -- CPU 5 Minute Average" > 3 Percent Average in 5.00 minutes',
                    "number": 319,
                    "ignoreUntil": 0,
                    "ignoreUid": -1,
                    "ignoreComment": None,
                    "thresholdId": 111423,
                    "alertFlowFalcon": None,
                    "closed": 1,
                    "closedKey": 0,
                    "indicatorId": -1,
                    "assignedTo": -1,
                    "comments": "",
                    "clearMessage": "issue is cleared by servicenow",
                    "acknowledgedBy": "",
                    "lastProcessed": 0,
                    "isMaintenanceAlert": False,
                },
                { 
                    "thresholdName": None,
                    "policyName": None,
                    "objectName": None,
                    "indicatorName": None,
                    "id": 402,
                    "severity": 4,
                    "origin": "system",
                    "deviceId": 384,
                    "pluginName": "KANKEI_NAI",
                    "objectId": 34154,
                    "pollId": -1,
                    "startTime": 1623690903000,
                    "endTime": 1623748142000,
                    "clearTime": 0,
                    "message": 'Threshold triggered -- LAN_SEVONE -- "IgnoreAutoClearSO -- CPU7 -- CPU 5 Minute Average" > 3 Percent Average in 5.00 minutes',
                    "number": 319,
                    "ignoreUntil": 0,
                    "ignoreUid": -1,
                    "ignoreComment": None,
                    "thresholdId": 111423,
                    "alertFlowFalcon": None,
                    "closed": 1,
                    "closedKey": 0,
                    "indicatorId": -1,
                    "assignedTo": -1,
                    "comments": "",
                    "clearMessage": "issue is cleared by sevone",
                    "acknowledgedBy": "",
                    "lastProcessed": 0,
                    "isMaintenanceAlert": False,
                }

            ]
        else:
            alerts = [
                {
                    "thresholdName": None,
                    "policyName": None,
                    "objectName": None,
                    "indicatorName": None,
                    "id": 30,
                    "severity": 4,
                    "origin": "system",
                    "deviceId": 384,
                    "pluginName": "KANKEI_NAI",
                    "objectId": 34154,
                    "pollId": -1,
                    "startTime": 1623690903000,
                    "endTime": 1623748142000,
                    "clearTime": 0,
                    "message": 'Threshold triggered -- LAN_SEVONE -- "WiFi AP:APDario2 -- CPU7 -- CPU 5 Minute Average" > 1 Percent Average in 5.00 minutes',
                    "number": 319,
                    "ignoreUntil": 0,
                    "ignoreUid": -1,
                    "ignoreComment": None,
                    "thresholdId": 111423,
                    "alertFlowFalcon": None,
                    "closed": 0,
                    "closedKey": 0,
                    "indicatorId": -1,
                    "assignedTo": -1,
                    "comments": "",
                    "clearMessage": "",
                    "acknowledgedBy": "",
                    "lastProcessed": 0,
                    "isMaintenanceAlert": False,
                },
                {
                    "thresholdName": None,
                    "policyName": None,
                    "objectName": None,
                    "indicatorName": None,
                    "id": 31,
                    "severity": 3,
                    "origin": "system",
                    "deviceId": 384,
                    "pluginName": "KANKEI_NAI",
                    "objectId": 34154,
                    "pollId": -1,
                    "startTime": 1623690903000,
                    "endTime": 1623748142000,
                    "clearTime": 0,
                    "message": 'Threshold triggered -- LAN_SEVONE -- "WiFi AP:APDario2 -- CPU7 -- CPU 5 Minute Average" > 2 Percent Average in 5.00 minutes',
                    "number": 319,
                    "ignoreUntil": 0,
                    "ignoreUid": -1,
                    "ignoreComment": None,
                    "thresholdId": 111423,
                    "alertFlowFalcon": None,
                    "closed": 0,
                    "closedKey": 0,
                    "indicatorId": -1,
                    "assignedTo": -1,
                    "comments": "",
                    "clearMessage": "",
                    "acknowledgedBy": "",
                    "lastProcessed": 0,
                    "isMaintenanceAlert": False,
                },
                {
                    "thresholdName": None,
                    "policyName": None,
                    "objectName": None,
                    "indicatorName": None,
                    "id": 403,
                    "severity": 4,
                    "origin": "system",
                    "deviceId": 384,
                    "pluginName": "KANKEI_NAI",
                    "objectId": 34154,
                    "pollId": -1,
                    "startTime": 1623690903000,
                    "endTime": 1623748142000,
                    "clearTime": 0,
                    "message": 'Threshold triggered -- LAN_SEVONE -- "invalid message ',
                    "number": 319,
                    "ignoreUntil": 0,
                    "ignoreUid": -1,
                    "ignoreComment": None,
                    "thresholdId": 111423,
                    "alertFlowFalcon": None,
                    "closed": 0,
                    "closedKey": 0,
                    "indicatorId": -1,
                    "assignedTo": -1,
                    "comments": "",
                    "clearMessage": "",
                    "acknowledgedBy": "",
                    "lastProcessed": 0,
                    "isMaintenanceAlert": False,
                }
            ]

        logging.info("Finishing request to SevOne")

        return alerts

