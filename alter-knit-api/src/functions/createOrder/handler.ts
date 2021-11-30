import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import * as moment from 'moment-timezone';
import * as uuid from 'uuid'

import { FedexTokenResponse, Order } from 'src/models'

import { APIGatewayProxyResult } from 'aws-lambda'

const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');

const Handlebars = require("handlebars");
Handlebars.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

let region = "us-east-1"
let secret: any;
let decodedBinarySecret: any;
let secretName = "staging/alterknit"
let client = new AWS.SecretsManager({
  region: region
});
let fedex: { url: string, apiKey: string, secret: string };

export const handler = async (event: { body: string; }): Promise<APIGatewayProxyResult> => {
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
  // await placeOrder(order);
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

function instantiateFedex() {
  if (process.env.IS_OFFLINE) {
    return {
      url: 'https://apis-sandbox.fedex.com',
      apiKey: 'l7ad07a4c615344cbaa6c9a907aae5f2b6',
      secret: '3902d93046c14ddaaefe7ddaaf1d0304'
    };
  } else {
    return {
      url: '',
      apiKey: '',
      secret: ''
    };
  }
}

// sending email using SendGrid service
async function sendEmail(order: Order) {
  await getSecretsFromAWS();
  secret = JSON.parse(secret);
  console.log('test', secret);
  sgMail.setApiKey(secret.SendGridApiKey);
  const msg = {
    to: secret.EmailToAddress, // Change to your recipient
    from: secret.EmailFromAddress, // Change to your verified sender
    subject: 'AlterKnit Order Summary',
    text: 'AlterKnit Order Summary',
    html: renderHTML(order),
  };
  console.log('msg', msg);
  await sgMail
    .send(msg)
    .then((response: any) => {
      console.log('Email sent', response)
    })
    .catch((error: any) => {
      console.error(error)
      console.log(JSON.stringify(error.response.body.errors));
    });
}

// place order using fedex api
async function placeOrder(order: Order) {
  fedex = instantiateFedex();
  const tokenResponse: FedexTokenResponse = await getFedexTokens();
  console.log('tokenResponse: ', tokenResponse);
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
  let shipmentConfig = {
    method: 'post',
    url: `${fedex.url}/ship/v1/shipments`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + tokenResponse.access_token
    },
    data: {
      requestedShipment: {
        shipper: {
          streetLines: [
            order.addressInfo.address
          ],
          city: order.addressInfo.city,
          stateOrProvinceCode: order.addressInfo.city, // TODO get the statecode based of state
          // postalCode: 72601,
          // countryCode: US
        },
        recipients: {

        },
        pickupType: "USE_SCHEDULED_PICKUP", // "CONTACT_FEDEX_TO_SCHEDULE" "DROPOFF_AT_FEDEX_LOCATION" "USE_SCHEDULED_PICKUP"
        serviceType: "",
        packagingType: "",
        shippingChargesPayment: {

        },
        labelSpecification: {

        },
        requestedPackageLineItems: {

        }
      },
      labelResponseOptions: "URL_ONLY", // "URL_ONLY" "LABEL"
      accountNumber: {
        value: "789926450" // account number of the fedex user
      },
      shipAction: "CONFIRM" // "CONFIRM" "TRANSFER"
    }
  }


}

async function getFedexTokens() {
  var data = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': fedex.apiKey,
    'client_secret': fedex.secret
  });
  var config = {
    method: 'post',
    url: `${fedex.url}/oauth/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: data
  };
  try {
    let response = await axios(config);
    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {
    console.error('Error from getFedexToken fn: ', err);
    throw err;
  }

}

function renderHTML(order): string {
  const template = Handlebars.compile(
    fs.readFileSync(__dirname + "/orderTemplate.hbs", { flag: 'r' }).toString('utf8'),
    { noEscape: true }
  );
  const html = template(order);
  return html;
}

async function getSecretsFromAWS() {
  return new Promise(async (resolve) => {
    client.getSecretValue({ SecretId: secretName }, async function (err, data) {
      if (err) {
        console.error(err);
        throw err;
      }
      else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
          secret = data.SecretString;
        } else {
          // let buff = new Buffer.from(data.SecretBinary, 'base64');
          decodedBinarySecret = Buffer.from((data.SecretBinary as string), 'base64').toString('ascii')
        }
      }
      resolve(true);
    });
  });
}