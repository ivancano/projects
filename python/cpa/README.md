# Johns Creek Rekognition

## Bucket
Create a S3 bucket with the following folders:
- FacialMatch: photos of people used by AWS Rekognition. They must be uploaded manually. The name of the image must be {FirstName}_{LastName}-{index}.{extension} 
- deployment: store workdocs.yaml, rekognition.yaml and layer.zip

## IAM
Create a role for workdocs notifications with the policies listed below:
- AWSLambdaBasicExecutionRole
- AmazonWorkDocsFullAccess

## Workdocs
- Enable workdocs notifications using the ARN of the role created in the previous step.

## Cloudformation Parameters
- **--template-file**: template.yaml
- **--stack-name**: the name of the CF Stack
- **--s3-bucket**: the name of the bucket created on previous step
- **--capabilities**: CAPABILITY_IAM

## Parameters
- **ProjectName**: the project tag
- **CustomerName**: the customer tag
- **EnvironmentName**: the environment tag
- **S3Bucket**: name of the S3 Bucket to process images
- **S3BucketURL**: public URL of the S3 Bucket
- **OrganizationId**: Organization ID associated to workdocs
- **ARNWorkdocsSubscription**: ARN of the role used to workdocs notifications

## Deployment
- Deploy the solution using AWS-CLI
Example:
``
aws --region=us-west-2 cloudformation deploy --stack-name JohnsCreek-test-3 --template-file template.yaml --capabilities CAPABILITY_IAM --parameter-overrides S3Bucket=johns-creek-test ProjectName=JohnsCreek-test-3 CustomerName=JohnsCreek EnvironmentName=dev OrganizationId=d-926773bcd9 ARNWorkdocsSubscription=arn:aws:iam::589744697460:role/Lambda-Wordocs-Notifications S3BucketURL=https://johns-creek-test.s3.us-west-2.amazonaws.com
``

## Using
- Upload an image into workdocs
- After around 15'', click on image details, click on feedback button. You will see a comment with information about the image