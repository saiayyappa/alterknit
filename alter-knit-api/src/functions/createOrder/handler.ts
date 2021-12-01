import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'

import { FedexTokenResponse, Order } from 'src/models'

import { APIGatewayProxyResult } from 'aws-lambda'

const moment = require('moment-timezone');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const https = require('https');

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
  await getSecretsFromAWS();
  secret = JSON.parse(secret);
  console.log('secret', secret); // TODO :: remove this log in final deploy
  await docClient.put({
    TableName: process.env.ALTERKNIT_TABLE,
    Item: order
  }).promise();
  order.createdAt = moment.tz(order.createdAt).format('ll'); // re-formatted to human readable date
  const fedexResponse = await placeOrder(order);
  const attachments = await createAttachment(fedexResponse.output?.transactionShipments[0]?.pieceResponses[0]?.packageDocuments[0]?.url)
  await sendEmail(order, attachments);
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
    // TODO :: get from secrets -> for now use sandbox for staging and prod
    return {
      url: 'https://apis-sandbox.fedex.com',
      apiKey: 'l7ad07a4c615344cbaa6c9a907aae5f2b6',
      secret: '3902d93046c14ddaaefe7ddaaf1d0304'
    };
  }
}

// sending email using SendGrid service
async function sendEmail(order: Order, attachemnts: Array<any>) {
  sgMail.setApiKey(secret.SendGridApiKey);
  const msg = {
    to: secret.EmailToAddress, // TODO :: input correct input in final change
    from: secret.EmailFromAddress, // TODO :: set the verfied email sender (will be AlterKnit's prod sendgrid verifed sender email)
    subject: `AlterKnit Order Summary - Order Id: ${order.id}`,
    text: 'AlterKnit Order Summary',
    html: renderHTML(order),
    attachments: attachemnts
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
          "personName": order.addressInfo.firstName + ' ' + order.addressInfo.lastName,
          "emailAddress": order.addressInfo.email,
          "phoneNumber": order.addressInfo.phone,
          "companyName": (order.addressInfo.companyName) ? order.addressInfo.companyName : (order.addressInfo.firstName + ' ' + order.addressInfo.lastName)
        },
        "address": {
          "streetLines": [
            order.addressInfo.address
          ],
          "city": order.addressInfo.city,
          "stateOrProvinceCode": "NY", // TODO :: retrieve from state enum
          "postalCode": order.addressInfo.zipcode,
          "countryCode": "US"
        }
      },
      "recipients": [
        {
          "contact": {
            "personName": "AlterKnit",
            "emailAddress": "saiayyappa1996@gmail.com", // TODO :: set AlterKnit's email address here
            "phoneNumber": "2124736363",
            "companyName": "AlterKnit New York"
          },
          "address": {
            "streetLines": [
              "CO Manhattan Wardrobe Supply", "245 W 29th St Suite 800"
            ],
            "city": "New York",
            "stateOrProvinceCode": "NY",
            "postalCode": "10001",
            "countryCode": "US",
            "residential": false
          }
        }
      ],
      "shipDatestamp": moment.utc(new Date()).tz('America/New_York').format('YYYY-MM-DD'),
      "serviceType": (order.deliverySpeed === "Rush") ? "STANDARD_OVERNIGHT" : "FEDEX_GROUND",
      "packagingType": "YOUR_PACKAGING",
      "pickupType": "USE_SCHEDULED_PICKUP",
      "shippingChargesPayment": {
        "paymentType": "RECIPIENT",
        "payor": {
          "responsibleParty": {
            "contact": {
              "personName": "AlterKnit",
              "emailAddress": "saiayyappa1996@gmail.com", // TODO :: set AlterKnit's email address here
              "phoneNumber": "2124736363",
              "companyName": "AlterKnit New York"
            },
            "address": {
              "streetLines": [
                "CO Manhattan Wardrobe Supply", "245 W 29th St Suite 800"
              ],
              "city": "New York",
              "stateOrProvinceCode": "NY",
              "postalCode": "10001",
              "countryCode": "US",
              "residential": false
            },
            "accountNumber": {
              "value": "510087860",
            }
          }
        }
      },
      "labelSpecification": {
        "labelFormatType": "COMMON2D",
        "imageType": "PDF",
        "labelStockType": "PAPER_7X475"
      },
      "requestedPackageLineItems": [
        {
          "sequenceNumber": "1",
          "groupPackageCount": 1,
          "weight": {
            "value": 1,
            "units": "LB"
          }
        }
      ]
    },
    "accountNumber": {
      "value": "510087860"
    }
  }
  console.log("Shipement Payload: ", JSON.stringify(createShipmentPayload))
  let shipmentConfig = {
    method: 'post',
    url: `${fedex.url}/ship/v1/shipments`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + tokenResponse.access_token
    },
    data: createShipmentPayload
  }
  try {
    let response = await axios(shipmentConfig);
    if (response.status === 200) {
      console.log('Final Response: ', JSON.stringify(response.data));
      return response.data;
    }
  } catch (err) {
    console.error('Error from placeOrder fn: ', err.response.data);
    throw err;
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
        if ('SecretString' in data) {
          secret = data.SecretString;
        } else {
          decodedBinarySecret = Buffer.from((data.SecretBinary as string), 'base64').toString('ascii')
        }
      }
      resolve(true);
    });
  });
}

function createAttachment(url: string): Promise<Array<any>> {
  return new Promise(async (resolve) => {
    let attachemnts = [];
    const file = fs.createWriteStream(__dirname + "/ShipmentOrder.pdf");
    await https.get(url, function (response) {
      response.pipe(file);
      response.on('end', function () {
        console.log(__dirname)
        let bitmap = fs.readFileSync(__dirname + '/ShipmentOrder.pdf');
        let base64String = Buffer.from(bitmap).toString('base64');
        attachemnts = [{
          filename: `ShipmentOrder.pdf`,
          content: base64String,
          type: 'application/pdf',
          disposition: 'attachment'
        }];
        resolve(attachemnts);
      });
    });
  });
}