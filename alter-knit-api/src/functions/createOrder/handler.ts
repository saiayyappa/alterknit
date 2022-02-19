import 'source-map-support/register';

import * as AWS from 'aws-sdk';
import * as moment from 'moment-timezone';
import * as uuid from 'uuid';

import { FedexTokenResponse, Order } from 'src/models/models';

import { APIGatewayProxyResult } from 'aws-lambda';
import { mockOrderPickUp, mockOrderShipIt } from './mock';

const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const https = require('https');

const Handlebars = require("handlebars");
const pdf = require("html-pdf-lambda");

Handlebars.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
Handlebars.registerHelper("inc", function (value) {
  return parseInt(value) + 1;
});
Handlebars.registerHelper('services', function (items, options) {
  return options.fn(items.join(', '));
});
moment.tz.add("America/New_York|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261t0 1nX0 11B0 1nX0 11B0 1qL0 1a10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x40 iv0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|21e6")

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
  // const partialOrder: Order = { ...mockOrderShipIt } as Order;
  // const partialOrder: Order = { ...mockOrderPickUp } as Order;
  const id = uuid.v4();

  if (partialOrder.username === 'guest') {
    partialOrder.username = 'guest_' + id;
  }

  const order: Order = {
    id: id,
    createdAt: moment.utc().format(), // YYYY-MM-DDThh:mm:ssZ
    orderNumber: Date.now().toString(),
    ...partialOrder
  };
  console.log('order:', order);
  const docClient = createDynamoDBClient();
  await getSecretsFromAWS();
  secret = JSON.parse(secret);
  // console.log('secret', secret);
  await docClient.put({
    TableName: process.env.ALTERKNIT_TABLE,
    Item: order
  }).promise();
  order.createdAt = moment.tz(order.createdAt, 'America/New_York').format('MMM DD, YYYY hh:mm:ss A'); // e.g for format: Aug 15,2019 12:22:51 PM
  const fedexResponse = await placeOrder(order);
  const attachments: any[] = await createAttachment(fedexResponse.output?.transactionShipments[0]?.pieceResponses[0]?.packageDocuments[0]?.url);
  const orderCopyHTML = renderHTML(order, "orderCopy.hbs");
  // fs.writeFileSync(__dirname + "/orderCopy.html", orderCopyHTML); // -- use only for local testing/development
  const PDF = await createPDF(orderCopyHTML);
  // let attachments = [];
  attachments.push({
    filename: `OrderCopy.pdf`,
    content: PDF,
    type: 'application/pdf',
    disposition: 'attachment'
  });
  await sendEmail(order, attachments);
  console.log("Resolving from createOrder");
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
    // setting from secrets
    return {
      url: secret.FedexURL, // FedexURL
      apiKey: secret.FedexApiKey, // FedexApiKey
      secret: secret.FedexSecret // FedexSecret
    };
  }
}

// sending email using SendGrid service
async function sendEmail(order: Order, attachments: Array<any>) {
  sgMail.setApiKey(secret.SendGridApiKey);
  const msg = {
    personalizations: [
      {
        to: [{ "email": order.addressInfo.email }], // customer email address
        bcc: [{ "email": secret.BccEmailToAddress }], // bcc to alterknit/any custom email set from secrets manager - BccEmailToAddress
      }
    ],
    from: secret.EmailFromAddress, // verified email sender (will be AlterKnit's prod sendgrid verifed sender email)
    subject: `AlterKnit Order Summary - Order #${order.orderNumber}`,
    text: 'AlterKnit Order Summary',
    html: renderHTML(order, "orderTemplate.hbs"),
    attachments: attachments
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
          "stateOrProvinceCode": order.addressInfo.state, // this will contain stateCode (enum from UI)
          "postalCode": order.addressInfo.zipcode,
          "countryCode": "US"
        }
      },
      "recipients": [
        {
          "contact": {
            "personName": "AlterKnit",
            "emailAddress": secret.EmailFromAddress, // set AlterKnit's email address here
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
              "emailAddress": secret.EmailFromAddress, // setting AlterKnit's email address here - EmailFromAddress
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
              "value": secret.FedexAccNumber, // change to correct acc no (value) in Secrets manager key is -> FedexAccNumber
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
      "value": secret.FedexAccNumber
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

function renderHTML(order, fileName): string {
  const template = Handlebars.compile(
    fs.readFileSync(__dirname + "/" + fileName, { flag: 'r' }).toString('utf8'),
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
    let attachments = [];
    const file = fs.createWriteStream("/tmp/ShipmentOrder.pdf");
    await https.get(url, function (response) {
      response.pipe(file);
      response.on('end', function () {
        console.log(__dirname)
        let bitmap = fs.readFileSync('/tmp/ShipmentOrder.pdf');
        let base64String = Buffer.from(bitmap).toString('base64');
        attachments = [{
          filename: `ShipmentOrder.pdf`,
          content: base64String,
          type: 'application/pdf',
          disposition: 'attachment'
        }];
        resolve(attachments);
      });
    });
  });
}

const createPDF = (html) => new Promise((resolve, reject) => {
  pdf
    .create(html)
    .then((res) => {
      resolve(res.toString('base64'));
    })
    .catch((error) => {
      console.error(error);
      reject(error);
    });
});
