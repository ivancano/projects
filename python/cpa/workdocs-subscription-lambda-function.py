import logging
import os
import boto3
import cfnresponse

log = logging.getLogger()
log.setLevel(logging.INFO)

e = os.environ
ORGANIZATION_ID = e['ORGANIZATION_ID']
ENDPOINT = e['ENDPOINT']

workdocs = boto3.client('workdocs')

def lambda_handler(event, context):
    responseValue = 200
    responseData = {}
    responseData['Data'] = responseValue
    try:
        createSNSNotification(ORGANIZATION_ID, ENDPOINT)
        cfnresponse.send(event, context, cfnresponse.SUCCESS, responseData)
    except Exception as e:
        print(e)
        cfnresponse.send(event, context, cfnresponse.SUCCESS, responseData)
    return {
        'statusCode': 200
    }
    
def getSNSNotifications(organizationId):
    response = workdocs.describe_notification_subscriptions(
        OrganizationId=organizationId
    )
    
def createSNSNotification(organizationId, endpoint):
    response = workdocs.create_notification_subscription(
        OrganizationId=organizationId,
        Endpoint=endpoint,
        Protocol='HTTPS',
        SubscriptionType='ALL'
    )
    
def deleteSNSNotification(subscriptionId, organizationId):
    response = workdocs.delete_notification_subscription(
        OrganizationId=organizationId,
        SubscriptionId=subscriptionId
    )