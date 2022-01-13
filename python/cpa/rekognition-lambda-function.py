import json
import logging
import boto3
import os
import cfnresponse
import linecache
import sys

log = logging.getLogger()
log.setLevel(logging.INFO)

e = os.environ
S3_BUCKET = e['S3_BUCKET']
SQS_URL = e['SQS_URL']

rekognition = boto3.client('rekognition')
workdocs = boto3.client('workdocs')
s3 = boto3.resource('s3')
sqs = boto3.client('sqs')

def lambda_handler(event, context):
    responseValue = 200
    responseData = {}
    responseData['Data'] = responseValue
    try:
        for record in event["Records"]:
            if("receiptHandle" in record):
                sqs.delete_message(QueueUrl=SQS_URL, ReceiptHandle=record["receiptHandle"])
            params = json.loads(record["body"])
            mainProcess(params)
    except Exception as e:
        print("Main error")
        printException()
    return {
        'statusCode': 200
    }

def mainProcess(params):
    comment = ""
    people_comment = ""
    labels_comment = ""
    matches = []
    matchesAux = []

    try:
        if getComments(params["DocumentId"], params["VersionId"]) == False :
            labels = detect_labels(params["Bucket"], params["Key"])
            labelLogging = []
            if(labels != None):
                for label in labels["Labels"]:
                    if label["Confidence"] >= 90:
                        labels_comment += label["Name"] + ": " + str(round(label["Confidence"])) + "% \r\n"
                        labelLogging.append(label["Name"])
            
            detectedFaces = detectFaces(params["Key"], S3_BUCKET)
            if detectedFaces == True:
                faces = getFacesFromS3(S3_BUCKET, 'FacialMatch')
                for face in faces:
                    rekognitionResult = compareFaces(face, params["Key"], S3_BUCKET)
                    if(rekognitionResult != None):
                        matches.append(rekognitionResult)
            
            [matchesAux.append(x) for x in matches if x not in matchesAux]
            for m in matchesAux:
                if(m != None):
                    people_comment += m + "\r\n"
            
            if params["Folder"] != "" and params["Folder"] != "/":
                comment += "\r\nEvent/Location: " + params["Folder"] + "\r\n"
            
            if labels_comment != "":
                comment += "\r\nObjects\r\n"
                comment += labels_comment
            else:
                comment += "\r\nObjects\r\n"
                comment += "No Object recognized at 90% or better\r\n"
                
            if people_comment != "":
                comment += "\r\nPeople\r\n"
                comment += people_comment
            else:
                comment += "\r\nPeople\r\n"
                comment += "None Recognized\r\n"

            comment += "\r\nDetails\r\n"
            if("CreatedTimestamp" in params):
                comment += "Upload Date: " + params["CreatedTimestamp"] + "\r\n"
            else:
                comment += "Upload Date: Not Available \r\n"
            if("PhotoCreated" in params):
                comment += "Photo Created: " + params["PhotoCreated"] + "\r\n"
            else:
                comment += "Photo Created: Not Available \r\n"
            if("ImageWidth" in params):
                comment += "Image Width: " + str(params["ImageWidth"]) + "\r\n"
            else:
                comment += "Image Width: Not Available \r\n"
            if("ImageHeight" in params):
                comment += "Image Height: " + str(params["ImageHeight"]) + "\r\n"
            else:
                comment += "Image Height: Not Available \r\n"
            if("GPSLatitude0" in params):
                comment += "GPSInfo: " + str(params["GPSLatitude0"]) + '°' + str(params["GPSLatitude1"]) + "'" + str(params["GPSLatitude2"]) + '"' + str(params["GPSLatitudeRef"]) + " " + str(params["GPSLongitude0"]) + '°' + str(params["GPSLongitude1"]) + "'" + str(params["GPSLongitude2"]) + '"' + str(params["GPSLongitudeRef"]) + "\r\n"
            else:
                comment += "GPSInfo: Exif Detail Not Available \r\n"
            if("Location" in params):
                comment += "Location: " + str(params["Location"]) + "\r\n"
            else:
                comment += "Location: Exif Detail Not Available \r\n"
            createComment(params["DocumentId"], params["VersionId"], comment)
            deleteFile(params["Bucket"], params["Key"])
            result = {
                "Image": params["Key"],
                "Comments": "NO",
                "Detected Faces": str(detectedFaces),
                "Location": params["Folder"],
                "Objects": ",".join(labelLogging),
                "People": ",".join(matchesAux),
                "Comment": "POSTED"
            }
            print(result)
        else:
            result = {
                "Image": params["Key"],
                "Comments": "YES",
                "Detected Faces": "N/A",
                "Location": "N/A",
                "Objects": "N/A",
                "People": "N/A",
                "Comment": "N/A",
            }
            print(result)
    except Exception as e:
            print(e)
    
def printException():
    exc_type, exc_obj, tb = sys.exc_info()
    f = tb.tb_frame
    lineno = tb.tb_lineno
    filename = f.f_code.co_filename
    linecache.checkcache(filename)
    line = linecache.getline(filename, lineno, f.f_globals)
    print('EXCEPTION IN ({}, LINE {} "{}"): {}'.format(filename, lineno, line.strip(), exc_obj))

def detect_labels(bucket, key):
    result = None
    try:
        response = rekognition.detect_labels(
            Image={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': key
                }
            }
        )
        result = response
    except Exception as e:
        print("Error Rekognition Labels")
        print(e)
    return result
    
def createComment(document_id, version_id, text):
    response = workdocs.create_comment(
        DocumentId=document_id,
        VersionId=version_id,
        Text=text,
        Visibility='PUBLIC',
        NotifyCollaborators=False
    )
    
def getFacesFromS3(bucket, folder):
    list_keys = []
    my_bucket = s3.Bucket(bucket)
    prefix = folder+"/"
    for object_summary in my_bucket.objects.filter(Prefix=folder+"/"):
        if(object_summary.key != prefix):
            list_keys.append(object_summary.key)
    return list_keys
    
def compareFaces(sourceKey, targetKey, bucket):
    result = None
    try:
        response = rekognition.compare_faces(
            SourceImage={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': sourceKey,
                }
            },
            TargetImage={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': targetKey
                }
            }
        )
        if(len(response['FaceMatches'])):
            aux1 = sourceKey.replace("FacialMatch/", "").replace(".jpg", "").replace(".jpeg", "").replace(".png", "").replace(".JPG", "").replace(".JPEG", "").replace(".PNG", "")
            aux2 = aux1.split("-")
            aux3 = aux2[0].split("_")
            result = aux3[0] + " " + aux3[1]
        return result
    except rekognition.exceptions.InvalidParameterException as e:
        print("Error Rekognition Faces")
        printException()
        return result
    except Exception as e:
        printException()
        return result

def detectFaces(image, bucket):
    result = False
    try:
        response = rekognition.detect_faces(
            Image={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': image,
                }
            }
        )
        if len(response['FaceDetails']) > 0:
            result = True
        return result
    except rekognition.exceptions.InvalidParameterException as e:
        print("Error Detecting Faces")
        printException()
        return result
    except Exception as e:
        printException()
        return result

def getComments(document_id, version_id):
    response = workdocs.describe_comments(
        DocumentId=document_id,
        VersionId=version_id
    )
    if len(response['Comments']) > 0:
        return True
    return False

def deleteFile(bucket, key):
    obj = s3.Object(bucket, key)
    obj.delete()