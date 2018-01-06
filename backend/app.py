from chalice import Chalice
import boto3
import json
from botocore.exceptions import ClientError
from chalice import NotFoundError

app = Chalice(app_name='backend')
S3 = boto3.client('s3', region_name='ap-south-1')
BUCKET = 'mytrah-output'

@app.route('/')
def index():
    return {'hello': 'world'}

def run_query(query, dataBase, s3_output):
    client = boto3.client('athena')
    response = client.start_query_execution(
        QueryString= query,
        QueryExecutionContext={
            'Database': dataBase
            },
        ResultConfiguration={
            'OutputLocation': s3_output,
            }
        )
    print('Execution ID: ' + response['QueryExecutionId'])
    return response
    
    
