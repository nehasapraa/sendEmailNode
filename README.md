# sendEmailNode
sendEmailNode is a service (backend + frontend) that accepts the necessary information and sends emails. It should provide an abstraction between two different email service providers. If one of the services goes down, your service can quickly failover to a different provider without affecting your customers.

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
