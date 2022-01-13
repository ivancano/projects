import logging
import os
import boto3
import urllib
import json
import requests
import cfnresponse
from PIL import Image, ExifTags
from PIL.ExifTags import GPSTAGS
from PIL.ExifTags import TAGS
from geopy.geocoders import Nominatim

log = logging.getLogger()
log.setLevel(logging.INFO)

e = os.environ
ORGANIZATION_ID = e['ORGANIZATION_ID']
ENDPOINT = e['ENDPOINT']
LAMBDA_IMAGE_REKOGNITION = e['LAMBDA_IMAGE_REKOGNITION']
S3_BUCKET = e['S3_BUCKET']
SQS_URL = e['SQS_URL']

workdocs = boto3.client('workdocs')
s3 = boto3.resource('s3')
lambda_client = boto3.client('lambda')
sqsClient = boto3.client('sqs')
sqsResource = boto3.resource('sqs')

def lambda_handler(event, context):
    responseValue = 200
    responseData = {}
    responseData['Data'] = responseValue
    try:
        if "SubscribeURL" in event:
            response = urllib.request.urlopen(event['SubscribeURL'])
        elif "Reprocess" in event:
            files = event['Data']
            for f in files:
                print(f['name'])
                mainProcess(f['version_id'], f['document_id'])
        else:
            message = event['Message']
            message_dict = json.loads(message)
            workdocs_action = message_dict['action']
            if(workdocs_action == "upload_document_version"):
                version_id = message_dict['entityId']
                document_id = message_dict['parentEntityId']
                mainProcess(version_id, document_id)
        #cfnresponse.send(event, context, cfnresponse.SUCCESS, responseData)
    except Exception as e:
        print(e)
        #cfnresponse.send(event, context, cfnresponse.SUCCESS, responseData)
    return {
        'statusCode': 200
    }
    
def mainProcess(version_id, document_id):
    metadata = getDocument(document_id)
    if(metadata != None):
        document_folder = getDocumentPath(document_id)
        createdTimestamp = metadata['CreatedTimestamp'].strftime('%m/%d/%Y')
        docInfo = getUrlDocument(document_id, version_id)
        url = docInfo['url']
        contentType = docInfo['contentType']
        if(contentType == 'image/jpeg' or contentType == 'image/png'):
            exif = getExif(url)
            geotags = None
            if(exif != None):
                try:
                    exif_dict = getExifData(exif)
                    geotags = getGeotagging(exif)
                    geolocator = Nominatim(user_agent="jkdemo")
                except Exception as e:
                    print(e)
            moveFileToS3(url, S3_BUCKET, metadata['LatestVersionMetadata']['Name'])
            if(geotags != None):
                if(geotags['GPSLatitudeRef'] != ''):
                    location = None
                    try:
                        location = geolocator.reverse(getCoordinates(geotags))
                    except Exception as e:
                        print(e)
                    payload = {
                        "DocumentId": document_id,
                        "VersionId": version_id,
                        "Bucket": S3_BUCKET,
                        "Key": metadata['LatestVersionMetadata']['Name'],
                        "CreatedTimestamp": createdTimestamp,
                        "PhotoCreated": exif_dict['DateTimeOriginal'],
                        "ImageWidth": exif_dict['ExifImageWidth'],
                        "ImageHeight": exif_dict['ExifImageHeight'],
                        "GPSLatitude0": str(geotags['GPSLatitude'][0]),
                        "GPSLatitude1": str(geotags['GPSLatitude'][1]),
                        "GPSLatitude2": str(geotags['GPSLatitude'][2]),
                        "GPSLatitudeRef": str(geotags['GPSLatitudeRef']),
                        "GPSLongitude0": str(geotags['GPSLongitude'][0]),
                        "GPSLongitude1": str(geotags['GPSLongitude'][1]),
                        "GPSLongitude2": str(geotags['GPSLongitude'][2]),
                        "GPSLongitudeRef": str(geotags['GPSLongitudeRef']),
                        "Location": str(location.address) if location != None else "",
                        "Folder": document_folder
                    }
                else:
                    payload = {
                            "DocumentId": document_id,
                            "VersionId": version_id,
                            "Bucket": S3_BUCKET,
                            "Key": metadata['LatestVersionMetadata']['Name'],
                            "CreatedTimestamp": createdTimestamp,
                            "PhotoCreated": exif_dict['DateTimeOriginal'],
                            "ImageWidth": exif_dict['ExifImageWidth'],
                            "ImageHeight": exif_dict['ExifImageHeight'],
                            "Folder": document_folder
                    }
            else:
                payload = {
                        "DocumentId": document_id,
                        "VersionId": version_id,
                        "Bucket": S3_BUCKET,
                        "Key": metadata['LatestVersionMetadata']['Name'],
                        "CreatedTimestamp": createdTimestamp,
                        "Folder": document_folder
                }
            sendSqsMessage(payload)
    else:
        return None
    
def sendSqsMessage(payload):
    sqsResponse = sqsClient.send_message(
                    QueueUrl=SQS_URL,
                    MessageBody=json.dumps(payload),
                    DelaySeconds=2
                )

def getUrlDocument(document_id, version_id):
    response = workdocs.get_document_version(
        DocumentId=document_id,
        VersionId=version_id,
        Fields='SOURCE'
    )
    url = response['Metadata']['Source']['ORIGINAL']
    return { "url": url, "contentType": response['Metadata']['ContentType'] }
    
def getDocument(document_id):
    response = workdocs.get_document(
        DocumentId=document_id,
        IncludeCustomMetadata=True
    )
    metadata = response['Metadata']
    return metadata
    
def getDocumentPath(document_id):
    folder = ""
    try:
        response = workdocs.get_document_path(
            DocumentId=document_id,
            Fields='NAME'
        )
        folder = response["Path"]["Components"][len(response["Path"]["Components"])-2]["Name"]
    except Exception as e:
        print(e)
    return folder
    
def createComment(document_id, version_id, text):
    response = workdocs.create_comment(
        DocumentId=document_id,
        VersionId=version_id,
        Text=text,
        Visibility='PUBLIC',
        NotifyCollaborators=False
    )

def moveFileToS3(url, bucket_name, key):
    try:
        url = url
        r = requests.get(url, stream=True)
        bucket = s3.Bucket(bucket_name)
        bucket.upload_fileobj(r.raw, key)
    except Exception as e:
        print(e)

def getExif(url):
    exifValue = None
    try:
        r = requests.get(url, stream=True)
        image = Image.open(r.raw)
        exifValue = image._getexif()
        return exifValue
    except Exception as e:
        print(e)
        return exifValue

def getExifData(exif):
    img_exif_dict = {}
    img_exif_data = {}
    if exif:
        img_exif_data = dict(exif)
        try:
            img_exif_dict['DateTimeOriginal'] = img_exif_data[36867]            
        except Exception as e:
            img_exif_dict['DateTimeOriginal'] = 'Exif Detail Not Available'
        try:
            img_exif_dict['ExifImageWidth'] = img_exif_data[40962]
        except Exception as e:
            img_exif_dict['ExifImageWidth'] = 'Exif Detail Not Available'
        try:
            img_exif_dict['ExifImageHeight'] = img_exif_data[40963]
        except Exception as e:
            img_exif_dict['ExifImageHeight'] = 'Exif Detail Not Available'
    else:
        img_exif_dict['DateTimeOriginal'] = 'Exif Detail Not Available'
        img_exif_dict['ExifImageWidth'] = 'Exif Detail Not Available'
        img_exif_dict['ExifImageHeight'] = 'Exif Detail Not Available'       
    return img_exif_dict 

def getGeotagging(exif):
    geotagging = {
            'GPSLatitude':('','',''),
            'GPSLatitudeRef':'',
            'GPSLongitude':('','',''),
            'GPSLongitudeRef':'',
        }
    if exif:
        for (idx, tag) in TAGS.items():
            if tag == 'GPSInfo':
                if idx not in exif:
                    continue
                for (key, val) in GPSTAGS.items():
                    if key in exif[idx]:
                        geotagging[val] = exif[idx][key]

    return geotagging
    
def getDecimalFromDms(dms, ref):
    degrees = dms[0]
    minutes = dms[1] / 60.0
    seconds = dms[2] / 3600.0
    if ref in ['S', 'W']:
        degrees = -degrees
        minutes = -minutes
        seconds = -seconds

    return round(degrees + minutes + seconds, 5)
    
def getCoordinates(geotags):
    lat = getDecimalFromDms(geotags['GPSLatitude'], geotags['GPSLatitudeRef'])
    lon = getDecimalFromDms(geotags['GPSLongitude'], geotags['GPSLongitudeRef'])
    return (lat,lon)