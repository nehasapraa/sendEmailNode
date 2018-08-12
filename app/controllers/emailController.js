/**
 * Email Controlller
 */
var path = require('path');
var ResilientMailerService = require(path.join(__dirname, '../', "services/ResilientMailerService"));
var mailer = new ResilientMailerService();

function sendEmail(req, res) {


    mailer.mail(req, function (error) {

        if (error) {
            res.render('error', {
                status: error.httpStatusCode,
                message: error.httpResponseData,

            });
            console.log('All providers failed.');
        } else {
            res.render('index', {
                sent: true,
            });
        }

    });

}

module.exports = {sendEmail};