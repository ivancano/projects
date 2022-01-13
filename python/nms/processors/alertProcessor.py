import logging
import json
import time
import hashlib
import datetime
import time
from database import Database
from multiprocessing import Pool
import asyncio


class AlertProcessor:
    database = None

    def __init__(self, config, input, output):
        self.config = config
        self.input = input
        self.output = output

    def setDatabase(self, database):
        self.database = database

    def execute(self):
        currentTimestamp = int(time.time()) # seconds
        # get first the non-closed alert in case comes one open and one closed with the same alertID
        self.getAlerts(currentTimestamp, False)
        self.getAlerts(currentTimestamp, True)
        asyncio.run(self.sendAlerts())

    def getAlerts(self, currentTimestamp, closed ):
        alerts = self.input.getAlertList(currentTimestamp, closed)
        if (alerts is not None) and (len(alerts) > 0):
            alertsCount = len(alerts)
            alertsValid = alertsCount
            logging.info("=" * 50)
            logging.info(f"Alarms with closed {closed} received: {alertsCount}")
            logging.info("=" * 50)
            logging.debug(f"received data: {alerts}")
            for alert in alerts:
                if (
                    self.parseMessage(alert)
                    and self.mapSeverity(alert)
                    and self.deviceGroupCheck(alert)
                    and self.calculateParameter1(alert)
                    and not self.autoClearedCheck(alert)
                ):
                    alert["source"] = self.input.getSource()
                    alert["created"] =  int(time.time())
                    alert["deviceName"] = self.removeDomains(alert["deviceName"])
                    alert["node"] = self.cleanNodes(alert["deviceName"])
                    alert["md5"] = hashlib.md5(
                                    json.dumps(self.createPayload(alert), sort_keys=True, indent=2).encode("utf-8")
                                    ).hexdigest()
                    logging.debug(f"saving alert in database: {alert}")
                    self.database.saveAlert(alert)
                else:
                    alertsValid = alertsValid - 1

            logging.info("=" * 50)
            logging.info(f"Alarms passing validation checks: {alertsValid}")
            logging.info(f"Alarms discarded: {alertsCount - alertsValid}")
            logging.info("=" * 50)

    def autoClearedCheck(self, alert):
        result = False
        if alert["closed"] == 1:
            if ("invalidClearMessage" in self.config):
                for key in self.config["invalidClearMessage"]:
                    if alert["clearMessage"].lower().find(key.lower()) != -1:
                        logging.debug(f"Closed {alert['id']} ignored because is an autoclear")
                        result = True
                        break
            return result
    def deviceGroupCheck(self, alert):
        if ("blankedDeviceGroups" in self.config) and (alert["deviceGroup"] in self.config["blankedDeviceGroups"]):
            return True
        else:
            logging.debug(f"Alert {alert['id']} ignored because belongs to an non blanked device group {alert['deviceGroup']}  ")
            return False

    def calculateParameter1(self, alert):
        result = False
        if ("toolsNetworkAutomationKeys" in self.config) and ("toolsNetworkAutomationTag" in self.config):
            for key in self.config["toolsNetworkAutomationKeys"]:
                if alert["message"].lower().find(key.lower()) != -1:
                    alert["parameter1"] = self.config["toolsNetworkAutomationTag"]
                    return True
        if (("blankedDeviceGroups" in self.config) and (alert["deviceGroup"] in self.config["blankedDeviceGroups"])):
            alert["parameter1"] = self.config["blankedDeviceGroups"][alert["deviceGroup"]]
            result = True
        return result

    def removeDomains(self, deviceName):
        if "domainList" in self.config:
            for domain in self.config["domainList"]:
                deviceName = deviceName.replace(f".{domain}", "")
        return deviceName

    def cleanNodes(self, node):
        if "nodeKeys" in self.config:
            for nkey in self.config["nodeKeys"]:
                node = node.replace(f"{nkey}", "")
        return node

    def mapSeverity(self, alert):
        result = False
        if ("severity" in self.config) and (str(alert["severity"]) in self.config["severity"]):
            if int(alert["closed"]) == 1:
                alert["severity"] = 0
            else:
                alert["severity"] = self.config["severity"][str(alert["severity"])][0]
                logging.debug(f"{alert['id']} severity {alert['severity']}")
            result = True
        else:
            logging.debug(f"Alert id {alert['id']} ignored because has a severity {alert['severity']}")

        return result

    def parseMessage(self, alert):
        result = False
        hyphensSegments = alert["message"].split('"')
        logging.debug(f"{alert['id']} hyphensSegments {hyphensSegments}")
        if len(hyphensSegments) == 3:
            dashesFirtSegment = hyphensSegments[0].split("--")
            dashesSecondSegment = hyphensSegments[1].split("--")
            logging.debug(f"{alert['id']} dashesFirtSegment {dashesFirtSegment}")
            logging.debug(f"{alert['id']} dashesSecondSegment {dashesSecondSegment}")
            if (len(dashesFirtSegment) == 3) and (len(dashesSecondSegment) == 3):
                alert["triggerType"] = dashesFirtSegment[0].strip()
                alert["deviceGroup"] = dashesFirtSegment[1].strip()
                alert["deviceName"] = dashesSecondSegment[0].strip()
                alert["objectName"] = dashesSecondSegment[1].strip()
                alert["indicatorNameMessage"] = dashesSecondSegment[2].strip()
                alert["alertDescription"] = hyphensSegments[2].strip()
                alert['doi']                  = hyphensSegments[1].strip()
                logging.debug(f"mutated alert: {alert}")
                result = True
            else:
                logging.debug(f"{alert['id']} parsing of -- fail in {alert['message']}")
        else:
            logging.debug(f"{alert['id']} parsing of \" fail in {alert['message']}")
        return result

    
    async def sendAlerts(self):
        time.sleep(20)
        CLOSED = 1
        OPEN = 0
        # get the closed alerts to send
        alerts = self.database.getAlerts(CLOSED)
        logging.info(f"Sending {len(alerts)} closed Alerts")
        qtyclosed = 0
        for closedAlert in alerts:
            # get unclosed alerts with the same doi
            openAlertsDOI = self.database.getAlertsDOI(closedAlert["doi"], OPEN)
            if len(openAlertsDOI) == 0:
                if (closedAlert["sentTimestamp"]!=0):
                    #this alert was sent to SNOW we must close it
                    if self.processSendAlert(closedAlert) == True:
                        qtyclosed +=1 
                        closedAlert["sentTimestamp"] = time.time()
                        self.database.updateAlert(closedAlert)
                    else:
                        logging.debug(f"{closedAlert['id']} failed to be sent to SNOW")
                else:
                    # ignore close alert because no alert has been sent to SNOW
                    # update it as "sent"
                    logging.debug(f"Close alert  {closedAlert['id']} will not be sent because the no related alert has been sent to snow")
                    closedAlert["sentTimestamp"] = time.time()
                    self.database.updateAlert(closedAlert)
            else:
                qtySent = 0
                for openAlert in openAlertsDOI:
                    # check if has been sent
                    if (
                        openAlert["updated"] > openAlert["sentTimestamp"]
                        or openAlert["created"] > openAlert["sentTimestamp"]
                    ):
                        # alert not sent. DO not send it because now is cleared
                        logging.debug(f"{openAlert['id']} will not be sent because the alert {closedAlert['id']} with same DOI {closedAlert['doi']} has been closed")
                        openAlert["sentTimestamp"] = time.time()
                        self.database.updateAlert(openAlert)
                    else:
                        # alert with same doi has been sent to SNOW.
                        qtySent += 1

                    # clear the openAlert alert in SevOne
                    if self.input.clearAlert(openAlert["id"]):
                        logging.debug(f"{openAlert['id']} has been cleared because the alert {closedAlert['id']} with same DOI {closedAlert['doi']} has been closed")

                
                if qtySent > 0:
                    # if an alert was sent to SNOW then we must send the closed
                    if self.processSendAlert(closedAlert) == True:
                        qtyclosed +=1 
                        closedAlert["sentTimestamp"] = time.time()
                        self.database.updateAlert(closedAlert)
                    else:
                        logging.debug(f"{closedAlert['id']} failed to be sent to SNOW")
                else:
                    # if no alert was sent to SNOW then we must mark as sent the closed and not send it to snow
                    logging.debug(f"Close alert  {closedAlert['id']} will not be sent because the no related open alert has been sent to snow")
                    closedAlert["sentTimestamp"] = time.time()
                    self.database.updateAlert(closedAlert)
        logging.debug("=" * 50)
        logging.debug(f"Closed alerts sent to SNOW {qtyclosed}")
        logging.debug("=" * 50)

        # get the open alerts to send
        qtyOpen = 0
        alerts = self.database.getAlerts(OPEN)
        logging.info(f"Sending {len(alerts)} open Alerts")
        for alert in alerts:
            if self.processSendAlert(alert) == True:
                alert["sentTimestamp"] = time.time()
                self.database.updateAlert(alert)
                qtyOpen+=1
            else:
                logging.debug(f"{alert['id']} failed to be sent")
        logging.debug("=" * 50)
        logging.debug(f"Open alerts sent to SNOW {qtyOpen}")
        logging.debug("=" * 50)

    def processSendAlert(self, alert):
        try:
            payload = self.createPayload(alert)
            if len(payload) == 0:
                logging.error(f"Payload empty for alert")
                return False
            else:
                return self.output.sendAlert(payload)
        except Exception as e:
            logging.error(f"Error while sending alert {alert['id']}. Reason : {e}")
            return False

    def createPayload(self, alert):
        payload = {
            "source": alert["source"],
            "node": alert["node"],
            "severity": alert["severity"],
            "resource": alert["objectName"],
            "metric_name": alert["indicatorNameMessage"],
            "description": alert["message"],
            "message_key": alert["doi"],
            "Alert_id": alert["id"],
            "parameter1": alert["parameter1"],
            "Sevone_time_of_event": datetime.datetime.fromtimestamp(int(alert["startTime"]) / 1000).strftime("%Y-%m-%d %H:%M:%S (GMT)"),
        }
        return payload
