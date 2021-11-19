import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import * as moment from 'moment-timezone';
import * as uuid from 'uuid'

import { APIGatewayProxyResult } from 'aws-lambda'
import { Order } from 'src/models'

const sgMail = require('@sendgrid/mail')

export const handler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('Event', event);
  const partialOrder: Order = JSON.parse(event.body) as Order;
  const id = uuid.v4();
  const order: Order = {
    id: id,
    createdAt: moment.utc().format(), // YYYY-MM-DDThh:mm:ssZ
    ...partialOrder
  };
  console.log('order', order);
  const docClient = createDynamoDBClient();
  await docClient.put({
    TableName: process.env.ALTERKNIT_TABLE,
    Item: order
  }).promise();
  await sendEmail();
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
async function sendEmail() {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: 'saiayyappa1996@gmail.com', // Change to your recipient
    from: 'saiayyappaor@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  console.log(msg);
  await sgMail
    .send(msg)
    .then((response) => {
      console.log('Email sent', response)
    })
    .catch((error) => {
      console.error(error)
    })
}