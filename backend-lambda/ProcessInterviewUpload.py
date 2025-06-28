import boto3
import json
import urllib.parse
import uuid
from datetime import datetime

s3 = boto3.client('s3')
transcribe = boto3.client('transcribe')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ZeroQueueTranscriptLogs')

def lambda_handler(event, context):
    print("Event:", json.dumps(event))
    record = event['Records'][0]
    bucket = record['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(record['s3']['object']['key'])
    file_uri = f's3://{bucket}/{key}'
    
    job_name = f"zeroqueue-{uuid.uuid4()}"
    
    transcribe.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={'MediaFileUri': file_uri},
        MediaFormat='mp4',
        LanguageCode='en-US',
        OutputBucketName='zeroqueue-interview-videos'
    )
    
    # Log to DynamoDB
    table.put_item(Item={
        'submission_id': job_name,
        'timestamp': datetime.utcnow().isoformat(),
        's3_key': key,
        'status': 'TRANSCRIBING'
    })
    
    return {
        'statusCode': 200,
        'body': f"Started transcription job: {job_name}"
    }
