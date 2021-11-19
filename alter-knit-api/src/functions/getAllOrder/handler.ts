import 'source-map-support/register'

import * as AWS from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { Order } from 'src/models';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event', event);
  const docClient = createDynamoDBClient();
  const result = docClient.scan({
    TableName: process.env.ALTERKNIT_TABLE
  }).promise()

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Accept,Origin,DNT,User-Agent,Referer,Content-Type,X-Amz-Date,x-amz-date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET"
    },
    body: JSON.stringify({
      items: (await result).Items as Order[]
    })
  };
}
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    });
  }
  return new AWS.DynamoDB.DocumentClient();
}