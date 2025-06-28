import boto3
import json
from boto3.dynamodb.conditions import Attr

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('ZeroQueueTranscriptLogs')

    response = table.scan(
        FilterExpression=Attr('status').eq('ANALYZED')
    )

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(response['Items'])
    }
