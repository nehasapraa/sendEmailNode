/**
 * Mailgun Service
 */
var request = require("request");
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_TEST_DOMAIN = process.env.MAILGUN_TEST_DOMAIN;
const MAILGUN_HOSTNAME = 'https://api.mailgun.net';
const MAILGUN_SENDER = process.env.SENDER;

function sendEmail(req, res) {
    var emails = req.body.email.split(",");
    var emails_cc = req.body.email_cc.split(",");
    var emails_bcc = req.body.email_bcc.split(",");

    var formData = {
        from: MAILGUN_SENDER,
        to: emails,
        cc: emails_cc,
        bcc: emails_bcc,
        subject: 'TEST EMAIL FROM MAILGUN',
        text: 'Hello this is test email from MAILGUN.',
        encoding: 'utf-8'
    };
    var options = {
        url: MAILGUN_HOSTNAME+'/v3/' + MAILGUN_TEST_DOMAIN + '/messages',
        method: 'POST',
        auth: {
            'user': 'api',
            'pass': MAILGUN_API_KEY
        },
        formData: formData

    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.render('index', {
                sent: true,
                provider: 'MAILGUN',
                response: response
            });
            }
            else{
            res.render('error', {
                message: JSON.parse(body).message,
                status: response.statusCode,
            });
        }
        }
    );

}

module.exports = {sendEmail};