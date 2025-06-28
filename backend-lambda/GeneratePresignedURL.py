import boto3
import json
import uuid

s3 = boto3.client("s3")
BUCKET_NAME = "zeroqueue-interview-videos"

def lambda_handler(event, context):
    file_id = str(uuid.uuid4())
    key = f"uploads/{file_id}.mp4"

    presigned_url = s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": BUCKET_NAME, "Key": key, "ContentType": "video/mp4"},
        ExpiresIn=300  # 5 minutes
    )

    return {
        "statusCode": 200,
        "headers": { "Access-Control-Allow-Origin": "*" },
        "body": json.dumps({ "uploadUrl": presigned_url })
    }
