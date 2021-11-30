import 'source-map-support/register'

import * as AWS from 'aws-sdk'

import { APIGatewayProxyResult } from 'aws-lambda'
import { Details } from 'src/models';

const parser = require('lambda-multipart-parser');

const sgMail = require('@sendgrid/mail');

const fs = require('fs');
let region = "us-east-1"
let secret;
let decodedBinarySecret;
let secretName = "staging/alterknit"
let client = new AWS.SecretsManager({
  region: region
});
const Handlebars = require("handlebars");
Handlebars.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

export const handler = async (event): Promise<APIGatewayProxyResult> => {
  const result = await parser.parse(event);
  console.log('event: ', result);
  let attachments = result.files.map((image) => {
    return {
      content: base64_encode(image.content),
      filename: image.filename,
      type: image.contentType,
      disposition: "attachment"
    }
  });
  let userDetails: Details = {
    firstName: result.firstName,
    lastName: result.lastName,
    phone: result.phone,
    email: result.email
  }
  await sendEmail(userDetails, attachments);
  return {
    headers: {
      "Access-Control-Allow-Headers": "Accept,Origin,DNT,User-Agent,Referer,Content-Type,X-Amz-Date,x-amz-date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST"
    },
    statusCode: 200,
    body: JSON.stringify({
      response: 'Email sent successfully'
    })
  };
}

function base64_encode(bitmap) {
  return Buffer.from(bitmap).toString('base64');
}


// sending email using SendGrid service
async function sendEmail(userDetails: Details, attachments: any[]) {
  await getSecretsFromAWS();
  secret = JSON.parse(secret);
  sgMail.setApiKey(secret.SendGridApiKey);
  const msg = {
    to: secret.EmailToAddress, // Change to your recipient
    from: 'praveenbalakrishnan@icloud.com', // Change to your verified sender
    subject: 'AlterKnit',
    text: 'AlterKnit',
    html: renderHTML(userDetails),
    attachments: attachments
  };
  await sgMail
    .send(msg)
    .then((response) => {
      console.log('Email sent', response)
    })
    .catch((error) => {
      console.error(error)
      console.log(JSON.stringify(error.response.body.errors))
    });
}

function renderHTML(userDetails: Details): string {
  const template = Handlebars.compile(
    fs.readFileSync(__dirname + "/contactUs.hbs", { flag: 'r' }).toString('utf8'),
    { noEscape: true }
  );
  const html = template(userDetails);
  console.log(html);
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