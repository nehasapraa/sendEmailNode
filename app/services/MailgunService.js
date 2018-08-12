/**
 * Mailgun Service
 */
var req = require("request");


module.exports = MailgunService;

/**
 * Creates an instance of the Mailgun email provider.
 *
 * @constructor
 * @this {MailgunService}
 */
function MailgunService(domain, apiKey, options) {
    if (typeof domain !== 'string'
        || typeof apiKey !== 'string') {
        throw new Error('Invalid parameters');
    }

    options = options || {};


    options.apiHostname = options.apiHostname || 'https://api.mailgun.net';

    this.domain = domain;
    this.apiKey = apiKey;
    this.options = options;
}


/**
 * Send email through Mailgun API.
 *
 * @this {MailgunService}
 * @param {Message} message The message to send.
 * @param {MailgunService} [callback] Notified when the attempt fails or succeeds.
 */
MailgunService.prototype.mail = function (message, callback) {

    var emails = message.body.email.split(",");
    var emails_cc = message.body.email_cc.split(",");
    var emails_bcc = message.body.email_bcc.split(",");

    var formData = {
        from: this.options.emailSender,
        to: emails,
        cc: emails_cc,
        bcc: emails_bcc,
        subject: this.options.emailSubject,
        text: 'Hello this is test email from MAILGUN.',
        encoding: 'utf-8'
    };
    var options = {
        url: this.options.apiHostname + '/v3/' + this.domain + '/messages',
        port: this.options.apiPort,
        method: 'POST',
        auth: {
            'user': 'api',
            'pass': this.apiKey
        },
        formData: formData


    };


    var request = req(options);
    if (!callback)
        return;

    request.on('error', function (error) {
        callback(error);
    });

    request.on('response', function (response) {
        if (response.statusCode == 200) {
            var provider ='Mailgun';
            callback();
            // callback();
            response.socket.end();
            return;
        }

        var body = '';

        response.on('data', function (chunk) {
            body += chunk;
        });

        response.on('end', function (chunk) {
            var error = new Error('Email could not be sent');
            error.httpStatusCode = response.statusCode;
            error.httpResponseData = JSON.parse(body).message;
            callback(error);
        });
    });
}
