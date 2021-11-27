import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import * as moment from 'moment-timezone';
import * as uuid from 'uuid'

import { FedexTokenResponse, Order } from 'src/models'

import { APIGatewayProxyResult } from 'aws-lambda'

const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const qs = require('qs');

export const handler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('Event', event);
  const partialOrder: Order = JSON.parse(event.body) as Order;
  const id = uuid.v4();
  const order: Order = {
    id: id,
    createdAt: moment.utc().format(), // YYYY-MM-DDThh:mm:ssZ
    ...partialOrder
  };
  console.log('order:', order);
  const docClient = createDynamoDBClient();
  await docClient.put({
    TableName: process.env.ALTERKNIT_TABLE,
    Item: order
  }).promise();
  await sendEmail(order);
  // await placeOrder();
  return {
    headers: {
      "Access-Control-Allow-Headers": "Accept,Origin,DNT,User-Agent,Referer,Content-Type,X-Amz-Date,x-amz-date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST"
    },
    statusCode: 201,
    body: JSON.stringify({
      item: order
    })
  };
}

// dynamo db client object generation based on environments
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    });
  }
  return new AWS.DynamoDB.DocumentClient();
}

// sending email using SendGrid service
async function sendEmail(order: Order) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: 'saiayyappa1996@gmail.com', // Change to your recipient
    from: 'saiayyappaor@gmail.com', // Change to your verified sender
    subject: 'AlterKnit Order',
    text: 'AlterKnit Order',
    html: `<div>${JSON.stringify(order)}</div>`,
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

// place order using fedex api
const fedexURL = "https://apis-sandbox.fedex.com";
async function placeOrder() {
  const tokenResponse: FedexTokenResponse = await getFedexTokens();
  console.log(tokenResponse);
  let createShipmentPayload = {
    "labelResponseOptions": "URL_ONLY",
    "requestedShipment": {
      "shipper": {
        "contact": {
          "personName": "SHIPPER NAME",
          "phoneNumber": 1234567890,
          "companyName": "Shipper Company Name"
        },
        "address": {
          "streetLines": [
            "SHIPPER STREET LINE 1"
          ],
          "city": "HARRISON",
          "stateOrProvinceCode": "AR",
          "postalCode": 72601,
          "countryCode": "US"
        }
      },
      "recipients": [
        {
          "contact": {
            "personName": "RECIPIENT NAME",
            "phoneNumber": 1234567890,
            "companyName": "Recipient Company Name"
          },
          "address": {
            "streetLines": [
              "RECIPIENT STREET LINE 1",
              "RECIPIENT STREET LINE 2"
            ],
            "city": "Collierville",
            "stateOrProvinceCode": "TN",
            "postalCode": 38017,
            "countryCode": "US"
          }
        }
      ],
      "shipDatestamp": "2020-07-03",
      "serviceType": "STANDARD_OVERNIGHT",
      "packagingType": "FEDEX_PAK",
      "pickupType": "USE_SCHEDULED_PICKUP",
      "blockInsightVisibility": false,
      "shippingChargesPayment": {
        "paymentType": "SENDER"
      },
      "labelSpecification": {
        "imageType": "PDF",
        "labelStockType": "PAPER_85X11_TOP_HALF_LABEL"
      },
      "requestedPackageLineItems": [
        {
          "groupPackageCount": 1,
          "weight": {
            "value": 10,
            "units": "LB"
          }
        },
        {
          "groupPackageCount": 2,
          "weight": {
            "value": 5,
            "units": "LB"
          }
        }
      ]
    },
    "accountNumber": {
      "value": "000561073"
    }
  }

}

async function getFedexTokens() {
  var data = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'l7f1c1d233004c47179570df7cac8a0905',
    'client_secret': 'ed3302b15f7b4cfd832f048bad2dd380'
  });
  var config = {
    method: 'post',
    url: `${fedexURL}/oauth/token`,
    headers: {
      'accept': 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: data
  };

  let response = await axios.post(config, data);
  return response;
}
