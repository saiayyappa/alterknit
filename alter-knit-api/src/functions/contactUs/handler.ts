import 'source-map-support/register'

import { APIGatewayProxyResult } from 'aws-lambda'
import { Details } from 'src/models';

const sgMail = require('@sendgrid/mail');

export const handler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('Event', event);
  let requestBody = JSON.parse(event.body);
  let images: any[] = requestBody.images;
  let userDetails: Details = {
    firstName: requestBody.firstName,
    lastName: requestBody.lastName,
    phone: requestBody.phone,
    email: requestBody.email
  }
  let attachments = images.map((image) => {
    return {
      content: image.url,
      filename: image.name,
      type: "application/image",
      disposition: "attachment"
    }
  });
  console.log('attachments: ', attachments);
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


// sending email using SendGrid service
async function sendEmail(userDetails: Details, attachments: any[]) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: userDetails.email, // Change to your recipient
    from: 'saiayyappaor@gmail.com', // Change to your verified sender
    subject: 'AlterKnit',
    text: 'AlterKnit',
    html: `<strong>This is the user info and their images as attachement</strong>
    First Name: ${userDetails.firstName}
    Last Name: ${userDetails.lastName}
    phone: ${userDetails.phone}
    email: ${userDetails.email}
    `,
    // attachments: attachments
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
    })
}
