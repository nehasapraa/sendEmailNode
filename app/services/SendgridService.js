/**
 * Sendgrid Service
 */
var http = require("https");
var path = require('path');
const SENDGRID_API_KEY = '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';
const SENDGRID_HOSTNAME = 'api.sendgrid.com';
const SENDGRID_SENDER = 'test.account@gmail.com';
const SENDGRID_SUBJECT = 'TEST EMAIL FROM SENDGRID';
var MailgunService = require(path.join(__dirname, '../', "services/MailgunService"));

function sendEmail(inputvar,response) {


    var emailRecipients = [],
        emailRecipientsCC = [],
        emailRecipientsBCC = [],
        emails = inputvar.body.email.split(","),
        emails_cc = inputvar.body.email_cc.split(","),
        emails_bcc = inputvar.body.email_bcc.split(",");

    emails.forEach(function (element) {
        emailRecipients.push({email: element})
    });
    emails_cc.forEach(function (element) {
        emailRecipientsCC.push({email: element})
    });
    emails_bcc.forEach(function (element) {
        emailRecipientsBCC.push({email: element})
    });

    var options = {
        "method": "POST",
        "hostname": SENDGRID_HOSTNAME,
        "port": null,
        "path": "/v3/mail/send",
        "headers": {
            "authorization": "Bearer "+SENDGRID_API_KEY,
            "content-type": "application/json"
        }
    };

        var req = http
            .request(options, function (res) {
            var chunks = [];

            //calls when error
           res.on("data", function (chunk) {
               MailgunService.sendEmail(inputvar,response);
               chunks.push(chunk);
            });

            res.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
            if(res.statusCode == '202'){
                console.log('request',res.statusCode);
                response.render('index', {
                    sent: true,
                    provider: 'SENDGRID',
                    response: res
                });
            }

        });
        req.write(JSON.stringify({
            content:
                [{
                    type: 'text/plain',
                    value: 'Hello this is test email from SENDGRID.'
                }],
            personalizations:
                [{
                    to: emailRecipients,
                    cc: emailRecipientsCC,
                    bcc: emailRecipientsBCC,
                    subject: SENDGRID_SUBJECT
                }],
            from: {email: SENDGRID_SENDER, name: 'Neha'},
            reply_to: {email: SENDGRID_SENDER, name: 'Neha'}
        }));
        req.end();



}
module.exports = {sendEmail};
