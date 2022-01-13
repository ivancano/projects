import logging
import mysql.connector


class Database:
    def __init__(self, config):
        self.config = config
        self.mydb = mysql.connector.connect(
            host=self.config["host"],
            user=self.config["user"],
            password=self.config["password"],
            port=self.config["port"],
            database=self.config["databaseName"],
            auth_plugin="mysql_native_password",
        )

    def initDatabase(self):
        logging.info(f"Initializing Database")
        query = f"""CREATE TABLE IF NOT EXISTS {self.config['tableName']} (
                    id INT NOT NULL,
                    md5 TEXT NOT NULL,
                    source TEXT NOT NULL,
                    severity INT NOT NULL,
                    deviceName TEXT NOT NULL,
                    objectName TEXT NOT NULL,
                    indicatorNameMessage TEXT NOT NULL,
                    message TEXT NOT NULL,
                    parameter1 TEXT NOT NULL,
                    created INT NOT NULL,
                    updated INT DEFAULT 0,
                    startTime BIGINT NOT NULL,
                    closed INT NOT NULL,
                    external_md5 TEXT,
                    sentTimestamp INT DEFAULT 0,
                    doi TEXT NOT NULL,
                    node TEXT NOT NULL,
                    PRIMARY KEY (id) );"""

        dbcursor = self.mydb.cursor()
        try:
            dbcursor.execute(query)
            self.mydb.commit()
            logging.info(f"Database initialized")
        except Exception as e:
            logging.error(f"Database has not been initialized. Reason : {e}")

    def saveAlert(self, alert):
        query = f"""INSERT INTO {self.config['tableName']} (id, md5, source, severity, deviceName, objectName,
                  indicatorNameMessage, message, parameter1, startTime, created, closed, doi, node)
                VALUES(%(id)s, %(md5)s, %(source)s, %(severity)s, %(deviceName)s,
                  %(objectName)s, %(indicatorNameMessage)s, %(message)s, %(parameter1)s,
                  %(startTime)s, %(createdUpdated)s, %(closed)s, %(doi)s, %(node)s)
                ON DUPLICATE KEY UPDATE
                  id                   =IF(md5 = %(md5)s, id, %(id)s),
                  source               =IF(md5 = %(md5)s, source, %(source)s),
                  severity             =IF(md5 = %(md5)s, severity, %(severity)s),
                  deviceName           =IF(md5 = %(md5)s, deviceName, %(deviceName)s),
                  objectName           =IF(md5 = %(md5)s, objectName, %(objectName)s),
                  indicatorNameMessage =IF(md5 = %(md5)s, indicatorNameMessage, %(indicatorNameMessage)s),
                  message              =IF(md5 = %(md5)s, message, %(message)s),
                  parameter1           =IF(md5 = %(md5)s, parameter1, %(parameter1)s),
                  startTime            =IF(md5 = %(md5)s, startTime, %(startTime)s),
                  updated              =IF(md5 = %(md5)s, updated, %(createdUpdated)s),
                  closed               =IF(md5 = %(md5)s, closed, %(closed)s),
                  doi                  =IF(md5 = %(md5)s, doi, %(doi)s),
                  node                 =IF(md5 = %(md5)s, node, %(node)s),
                  md5                  =IF(md5 = %(md5)s, md5, %(md5)s);"""

        values = {
            "id": alert["id"],
            "md5": alert["md5"],
            "source": alert["source"],
            "severity": alert["severity"],
            "deviceName": alert["deviceName"],
            "objectName": alert["objectName"],
            "indicatorNameMessage": alert["indicatorNameMessage"],
            "message": alert["message"],
            "parameter1": alert["parameter1"],
            "startTime": alert["startTime"],
            "createdUpdated": alert["created"],
            "closed": alert["closed"],
            "doi": alert["doi"],
            "node" : alert["node"]
        }
        dbcursor = self.mydb.cursor()
        try:
            dbcursor.execute(query, values)
            self.mydb.commit()
            logging.debug(f"alert {alert['id']} saved or updated on database")
        except Exception as e:
            logging.error(
                f"alert {alert['id']} failed to be saved on database. Reason : {e}"
            )

    def getAlerts(self, closedStatus):
        alerts = []
        query = f"""SELECT id, md5, source, severity, deviceName, objectName, indicatorNameMessage, message, parameter1, startTime, created, closed, doi, node, sentTimestamp
               FROM {self.config['tableName']} WHERE (updated > sentTimestamp
               OR created > sentTimestamp) and closed = {closedStatus};"""

        dbcursor = self.mydb.cursor()
        try:
            dbcursor.execute(query)
            rows = dbcursor.fetchall()
            columns = [col[0] for col in dbcursor.description]
            alerts = [dict(zip(columns, row)) for row in rows]
            logging.debug(
                f"List of Alerts with closed {closedStatus} to be sent: {alerts}"
            )
        except Exception as e:
            logging.error(f"Failed reading alerts from database. Reason : {e}")

        return alerts

    def getAlertsDOI(self, doi, closedStatus):
        alerts = []
        query = f"""SELECT id, md5, source, severity, deviceName, objectName, indicatorNameMessage, message, parameter1, startTime, created, closed, doi, node, updated, sentTimestamp
                FROM {self.config['tableName']} WHERE closed = {closedStatus} and  doi ='{doi}';"""
        dbcursor = self.mydb.cursor()
        try:
            dbcursor.execute(query)
            rows = dbcursor.fetchall()
            columns = [col[0] for col in dbcursor.description]
            alerts = [dict(zip(columns, row)) for row in rows]
        except Exception as e:
            logging.error(
                f"Failed reading alerts with same doi from database. Reason : {e}"
            )
        return alerts

    def updateAlert(self, alert):
        query = f"""UPDATE {self.config['tableName']}
                SET sentTimestamp={alert['sentTimestamp']}
                WHERE id = {alert['id']};"""

        dbcursor = self.mydb.cursor()
        try:
            dbcursor.execute(query)
            self.mydb.commit()
            logging.debug(f"alert {alert['id']} sent status updated on database")
        except Exception as e:
            logging.error(
                f"alert {alert['id']} failed to be saved on database. Reason : {e}"
            )
