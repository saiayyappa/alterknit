import 'source-map-support/register'

import { APIGatewayProxyResult } from 'aws-lambda'
import { Details } from 'src/models';

const parser = require('lambda-multipart-parser');

const sgMail = require('@sendgrid/mail');

export const handler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('Event', event);
  const result = await parser.parse(event);
  console.log(result);
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
  // console.log('attachments: ', attachments);
  await sendEmail(userDetails, attachments);
  return {
    headers: {
      "Access-Control-Allow-Headers": "Accept,Origin,DNT,User-Agent,Referer,Content-Type,X-Amz-Date,x-amz-date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST"
    },
    statusCode: 200,
    body: 'Email sent successfully'
  };
}

function base64_encode(bitmap) {
  return Buffer.from(bitmap).toString('base64');
}


// sending email using SendGrid service
async function sendEmail(userDetails: Details, attachments: any[]) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: userDetails.email, // Change to your recipient
    from: 'praveenbalakrishnan@icloud.com', // Change to your verified sender
    subject: 'AlterKnit',
    text: 'AlterKnit',
    html: `<strong>This is the user info and their images as attachement</strong>
    First Name: ${userDetails.firstName}
    Last Name: ${userDetails.lastName}
    phone: ${userDetails.phone}
    email: ${userDetails.email}`
    ,
    attachments: attachments
  };
  console.log(msg);
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
