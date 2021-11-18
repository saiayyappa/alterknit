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
    statusCode: 201,
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