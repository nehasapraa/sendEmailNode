# sendEmailNode
sendEmailNode is a service (backend + frontend) that accepts the necessary information and sends emails. It should provide an abstraction between two different email service providers. If one of the services goes down, your service can quickly failover to a different provider without affecting your customers.

This service is using http api calls for both providers(Mailgun and Sendgrid).No client libraries are used.

## How to run this service

From the command line

```cli
//install dependencies
npm install

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

Please check the ApplicationFlow.png to understand the flow of code.
