import boto3
import json
from datetime import datetime
import urllib.request

dynamodb = boto3.resource('dynamodb')
transcribe = boto3.client('transcribe')
bedrock = boto3.client('bedrock-runtime')
table = dynamodb.Table('ZeroQueueTranscriptLogs')

def lambda_handler(event, context):
    # Scan for pending jobs
    response = table.scan(
    FilterExpression="#s = :val",
    ExpressionAttributeNames={"#s": "status"},
    ExpressionAttributeValues={":val": "TRANSCRIBING"}
)

    for item in response['Items']:
        job_name = item['submission_id']
        print(f"Checking job: {job_name}")
        
        result = transcribe.get_transcription_job(TranscriptionJobName=job_name)
        status = result['TranscriptionJob']['TranscriptionJobStatus']

        if status == 'COMPLETED':
            transcript_uri = result['TranscriptionJob']['Transcript']['TranscriptFileUri']
            transcript_text = fetch_transcript_text(transcript_uri)
            print("Transcript:", transcript_text[:300])

            # Analyze using Claude (Bedrock)
            analysis = analyze_with_claude(transcript_text)
            print("Analysis:", analysis)

            # Update record in DynamoDB
            table.update_item(
                Key={
                    'submission_id': job_name,
                    'timestamp': item['timestamp']  # this must exactly match the original inserted value
                },
                UpdateExpression="SET #s = :s, transcript = :t, analysis = :a, analyzed_at = :ts",
                ExpressionAttributeNames={"#s": "status"},
                ExpressionAttributeValues={
                    ":s": "ANALYZED",
                    ":t": transcript_text,
                    ":a": analysis,
                    ":ts": datetime.utcnow().isoformat()
                }
            )

    return {"status": "done"}


def fetch_transcript_text(uri):
    import boto3
    import json
    import re

    s3 = boto3.client('s3')

    # Convert HTTP URI to S3 bucket and key
    # Example URI: https://s3.amazonaws.com/zeroqueue-interview-videos/zeroqueue-abc123.json
    match = re.search(r'https?://[^/]+/([^/]+)/(.+)', uri)
    if not match:
        raise ValueError(f"Invalid transcript URI: {uri}")

    bucket, key = match.groups()
    print(f"Fetching transcript from bucket: {bucket}, key: {key}")

    obj = s3.get_object(Bucket=bucket, Key=key)
    content = json.loads(obj['Body'].read())
    
    return content['results']['transcripts'][0]['transcript']

def analyze_with_claude(transcript_text):
    messages = [
        {
            "role": "user",
            "content": f"""
You are an AI interview coach. Analyze the following candidate's answer:

\"\"\"{transcript_text}\"\"\"

Return a JSON summary with the keys: 'score', 'strengths', 'weaknesses', 'tone', and 'summary'.
"""
        }
    ]

    body = json.dumps({
        "messages": messages,
        "max_tokens": 500,
        "temperature": 0.7,
        "anthropic_version": "bedrock-2023-05-31"
    })

    response = bedrock.invoke_model(
        modelId="anthropic.claude-3-sonnet-20240229-v1:0",
        body=body,
        contentType="application/json",
        accept="application/json"
    )

    result = json.loads(response['body'].read())
    return result["content"][0]["text"]