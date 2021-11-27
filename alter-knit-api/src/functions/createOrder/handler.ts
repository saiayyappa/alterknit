import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import * as moment from 'moment-timezone';
import * as uuid from 'uuid'

import { FedexTokenResponse, Order } from 'src/models'

import { APIGatewayProxyResult } from 'aws-lambda'

const sgMail = require('@sendgrid/mail');
const axios = require('axios');
const qs = require('qs');



let region = "us-east-1"
let secret;
let decodedBinarySecret;
let secretName = "staging/alterknit"
var client = new AWS.SecretsManager({
  region: region
});


async function getSecretsFromAWS() {
  return new Promise(async (resolve) => {
    client.getSecretValue({ SecretId: secretName }, async function (err, data) {
      if (err) {
        if (err.code === 'DecryptionFailureException')
          // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        else if (err.code === 'InternalServiceErrorException')
          // An error occurred on the server side.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        else if (err.code === 'InvalidParameterException')
          // You provided an invalid value for a parameter.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        else if (err.code === 'InvalidRequestException')
          // You provided a parameter value that is not valid for the current state of the resource.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        else if (err.code === 'ResourceNotFoundException')
          // We can't find the resource that you asked for.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
      }
      else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        console.log('alsdjflkjfsd')
        if ('SecretString' in data) {
          secret = data.SecretString;
        } else {
          // let buff = new Buffer.from(data.SecretBinary, 'base64');
          decodedBinarySecret = Buffer.from((data.SecretBinary as string), 'base64').toString('ascii')
        }
        // console.log('secret: ', secret);
        // console.log('decodedBinarySecret: ', decodedBinarySecret)
      }
      resolve(true);
    });
  });
}

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
  await getSecretsFromAWS();
  console.log(secret);
  secret = JSON.parse(secret);
  sgMail.setApiKey(secret.SendGridApiKey);
  let garments = '';
  order.garments.forEach(garment => {
    garments = `
<br>
    serviceNeeded ${garment.serviceNeeded.toString()}
<br>
    isDryCleaned ${garment.isDryCleaned}
<br>
    isCleaned ${garment.isCleaned}
<br>
    brand ${garment.brand}
<br>
    color ${garment.color}
<br>
    ageOfGarment ${garment.ageOfGarment}
<br>
    noOfHoles ${garment.noOfHoles}
<br>
    briefDescription ${garment.briefDescription}` + garments;
  });
  const msg = {
    to: secret.EmailToAddress, // Change to your recipient
    from: 'praveenbalakrishnan@icloud.com', // Change to your verified sender
    subject: 'AlterKnit Order',
    text: 'AlterKnit Order',
    html: `
    id: ${order.id}
    <br>
    createdAt: ${order.createdAt}
    <br>
    orderMethod: ${order.orderMethod}
    <br>
    garments:
    ${garments}
    <br>
    deliverySpeed: ${order.deliverySpeed}
    <br>
    addressInfo
    <br>
        firstName: ${order.addressInfo.firstName}
    <br>
        lastName: ${order.addressInfo.lastName}
    <br>
        address: ${order.addressInfo.address}
    <br>
        companyName: ${order.addressInfo.companyName}
    <br>
        city: ${order.addressInfo.city}
    <br>
        state: ${order.addressInfo.state}
    <br>
        zipcode: ${order.addressInfo.zipcode}
    <br>
        phone: ${order.addressInfo.phone}
    <br>
        email: ${order.addressInfo.email}
    <br>
        isBillingAddressSame: ${order.addressInfo.isBillingAddressSame}
    <br>
        buildingType: ${order.addressInfo.buildingType}
    <br>
        pickUpDate: ${order.addressInfo.pickUpDate}
    <br>
        pickUpTime: ${order.addressInfo.pickUpTime}
    <br>
    billingAddressInfo
    <br>
        firstName: ${order.billingAddressInfo.firstName}
    <br>
        lastName: ${order.billingAddressInfo.lastName}
    <br>
        address: ${order.billingAddressInfo.address}
    <br>
        companyName: ${order.billingAddressInfo.companyName}
    <br>
        city: ${order.billingAddressInfo.city}
    <br>
        state: ${order.billingAddressInfo.state}
    <br>
        zipcode: ${order.billingAddressInfo.zipcode}
    <br>
        phone: ${order.billingAddressInfo.phone}
    <br>
        email: ${order.billingAddressInfo.email}

    `,
  };
  console.log(msg);
  await sgMail
    .send(msg)
    .then((response) => {
      console.log('Email sent', response)
    })
    .catch((error) => {
      console.error(error)
    });
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
