/**
 * Email Controlller
 */
var path = require('path');
var SendgridService = require(path.join(__dirname, '../', "services/SendgridService"));


function sendEmail(req, res) {

     SendgridService.sendEmail(req,res);
}

module.exports = {sendEmail};