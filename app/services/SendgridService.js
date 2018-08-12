/**
 * Sendgrid Service
 */
var req= require("request");


module.exports = SendgridService;

/**
 * Creates an instance of the SendGrid email provider.
 *
 * @constructor
 * @this {SendgridService}
 */
function SendgridService(apiUser, apiKey, options) {
    if (typeof apiUser !== 'string'
        || typeof apiKey !== 'string') {
        throw new Error('Invalid parameters');
    }

    options = options || {};

    this.apiUser = apiUser;
    this.apiKey = apiKey;
    this.options = options;
}


/**
 * send email through the SendGrid API.
 *
 * @this {SendgridService}
 * @param {Message} message The message to send.
 * @param {SendgridService} [callback] Notified when the attempt fails or succeeds.
 */
SendgridService.prototype.mail = function (message, callback) {



    var options = {
        "method": "POST",
        "url": this.options.apiHostname+'/v3/mail/send',
        "port":  this.options.apiPort,
        "headers": {
            "authorization": "Bearer "+ this.apiKey,
            "content-type": "application/json"
        }
    };

    var emailRecipients = [],
        emailRecipientsCC = [],
        emailRecipientsBCC = [],
        emails = message.body.email.split(','),
        emails_cc = message.body.email_cc.split(','),
        emails_bcc = message.body.email_bcc.split(',');

    emails.forEach(function (element) {
        emailRecipients.push({email: element})
    });
    emails_cc.forEach(function (element) {
        emailRecipientsCC.push({email: element})
    });
    emails_bcc.forEach(function (element) {
        emailRecipientsBCC.push({email: element})
    });


    var request = req(options);

    request.write(JSON.stringify({
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
                subject: this.options.emailSubject
            }],
        from: {email: this.options.emailSender, name: 'Neha'},
        reply_to: {email: this.options.emailSender, name: 'Neha'}
    }));
    // if no callback, the outcome doesn't matter
    if (!callback)
        return;

    request.on('error', function (error) {
        callback(error);
    });

    request.on('response', function (response) {
        if (response.statusCode == 202) {
            var provider ='Sendgrid';

            callback();
            response.socket.end();
            return;
        }

        var body = '';

        response.on('data', function (chunk) {
            body += chunk;
            console.log('body,',body);
        });

        response.on('end', function (chunk) {
            var error = new Error('Email could not be sent');
            error.httpStatusCode = response.statusCode;
            error.httpResponseData = JSON.parse(body).errors[0].message;

            callback(error);
        });
    });
}
