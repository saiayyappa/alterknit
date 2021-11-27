## Local Setup

- For Local Setup, run the following

```
npm install
```

```
export IS_OFFLINE=true && sls offline start
```

## For deployment

- Configure sls to use our AWS Credentials

```
sls config credentials --provider aws --key YOUR_ACCESS_KEY --secret YOUR_SECRET_KEY --profile YOUR_AWS_PROFILE
```

- Deploy to AWS

```
sls deploy -v --aws-profile YOUR_AWS_PROFILE
```

## set sendgrid
```
echo "export SENDGRID_API_KEY='laksdlfasdlfls'" > sendgrid.env
```
```
echo "sendgrid.env" >> .gitignore
```
```
source ./sendgrid.env
```
```
npm install --save @sendgrid/mail
```
```js
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
javascript
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'test@example.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
```