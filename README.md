# sendEmailNode
sendEmailNode is a service (backend + frontend) that accepts the necessary information and sends emails. It should provide an abstraction between two different email service providers. If one of the services goes down, your service can quickly failover to a different provider without affecting your customers.

This service is using http api calls for both providers(Mailgun and Sendgrid).

## How to run this service

From the command line

```cli
//install dependencies
npm install

//seed the remote database with dummy data
npm run seed

//start REST server
npm start
```

Now, the service runs on your local machine. After running the rest server, the
command line will notify on which port the service is running on. Service
defaults localhost:3000/

By default Email will be sent by Sendgrid and if failover then it will use Mailgun provider.
### Web failover condition for sendgrid

```cli
enter same email address for email and CC or BCC.
```
Duplicate email address is not supported by Sendgrid.

### Code failover condition for sendgrid

```cli
Change API key for Sendgrid in the code.
```
This is compulsory to use above email address for Mailgun provider as we need to specify all email addresses in the Mailgun setting recipients list.This is because we are using their test domain for sending emails. If you want to send emails on your own account please let me know I will add the same in the Mailgun.

Please check the ApplicationFlow.png to understand the flow of code.
