var express = require('express');
var router = express.Router();
var path = require('path');
var emailController = require(path.join(__dirname,'../', "controllers/emailController"));


router.get('/', function(req, res) {
    res.render('index', { title: 'Small Email App' });
});
    router.post("/sendemail", emailController.sendEmail);


module.exports = router;