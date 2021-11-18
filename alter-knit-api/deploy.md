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
