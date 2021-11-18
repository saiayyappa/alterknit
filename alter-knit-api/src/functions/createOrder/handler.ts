import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'

import { APIGatewayProxyResult } from 'aws-lambda'
import { Order } from 'src/models'

export const handler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('Event', event);
  const partialOrder: Order = JSON.parse(event.body) as Order;
  const id = uuid.v4();
  const order: Order = {
    id: id,
    ...partialOrder
  };
  console.log('order', order);
  const docClient = createDynamoDBClient();
  await docClient.put({
    TableName: process.env.ALTERKNIT_TABLE,
    Item: order
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: order
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