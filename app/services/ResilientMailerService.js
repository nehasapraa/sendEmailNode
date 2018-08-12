/**
 *{ResilientMailerService}
 */
var path = require('path');

var MailgunProvider = require(path.join(__dirname, '/', "MailgunService"));
var SendgridProvider = require(path.join(__dirname, '/', "SendgridService"));


const MAILGUN_API_KEY=process.env.MAILGUN_API_KEY;
const MAILGUN_TEST_DOMAIN=process.env.MAILGUN_TEST_DOMAIN;
const MAILGUN_HOSTNAME = 'https://api.mailgun.net';
const MAILGUN_SUBJECT = 'TEST EMAIL FROM MAILGUN';


const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_USERNAME = process.env.SENDGRID_USERNAME;
const SENDGRID_HOSTNAME = 'https://api.sendgrid.com';
const SENDGRID_SUBJECT = 'TEST EMAIL FROM SENDGRID';

const API_PORT = '8080';

const MAIL_SENDER = 'bizztech8@gmail.com';

var options_mailgun = {
    emailSender: MAIL_SENDER,
    apiHostname: MAILGUN_HOSTNAME, // allows alternative hostname
    apiPort: API_PORT,            // allows unusual ports
    emailSubject: MAILGUN_SUBJECT,
};
var options_sendgrid = {
    emailSender: MAIL_SENDER,
    apiHostname: SENDGRID_HOSTNAME, // allows alternative hostname
    apiPort: API_PORT,             // allows unusual ports
    emailSubject: SENDGRID_SUBJECT
};


var mailgun = new MailgunProvider(MAILGUN_TEST_DOMAIN,MAILGUN_API_KEY , options_mailgun);
var sendgrid = new SendgridProvider(SENDGRID_USERNAME, SENDGRID_API_KEY, options_sendgrid);


/**
 * @constructor
 * @this {ResilientMailerService}
 */

function ResilientMailerService() {
    this.providers = [];
    this.addProvider(mailgun);
    this.addProvider(sendgrid);
}

ResilientMailerService.prototype.addProvider = function (provider) {
    this.providers.push(provider);
}


/**
 *
 * @this {ResilientMailerService}
 * @param {Message} message The message to send.
 * @param {ResilientMailerService} [callback] Notified when the attempt fails or succeeds.
 */
ResilientMailerService.prototype.mail = function (message, callback) {
    this._attempt(0, message, callback);
}

ResilientMailerService.prototype._attempt = function (index, message, callback) {
    var self = this;
    var provider = this.providers[index];

    provider.mail(message, function (error) {
        if (!error) {
            if (callback)
                callback(error);
            return;
        }

        index++;

        if (self.providers.length == index) {

            if (callback)
                callback(error);

            return;
        }



        self._attempt(index, message, callback);
    });
}
module.exports = ResilientMailerService;