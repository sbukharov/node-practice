/** Server file that handles request routing and responses.*/

/** Import dependencies*/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

/** Import config file (gitignored) containing config data*/
var config = require('./config');

var app = express();
/** Create views with jade*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
/** Init middleware*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

/** Set routes*/
app.get('/', function(req,res){
		res.render('index',{title:'Index'});
});
app.get('/index.html', function(req,res){
		res.render('index',{title:'Index'});
});
app.get('/about.html', function(req,res){
		res.render('about',{title:'About'});
});
app.get('/contact.html', function(req,res){
		res.render('contact',{title:'Contact'});
});

/** Contact form submission functonality - emails preset address with form details. */
app.post('/contact/send', function(req,res){
  // Init transporter, using google smtp server
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.fromEmail,
      pass: config.pass
    }
  });
  
  // Set email headers and body
  var mailOptions = {
    from: 'Mail Test <mental.health.bc.ca@gmail.com>',
    to: config.toEmail,
    subject: 'Website Submission',
    text: 'You have a submission with the following details... Name: '+req.body.name+' Email: '+req.body.email+' Message: '+req.body.message,
    html: '<p> You have a submission with the following details...</p> <ul> <li> Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Message: '+req.body.message+'</li></ul>'
  }
  
  // Send the email, loggin errors and successes.
  transporter.sendMail(mailOptions, function(error,info){
    if (error) {
      console.log(error);
      res.redirect("/");
    } else {
      console.log('Message sent '+info.response);
      res.redirect("/");
    }
  });    
});

/** Run on port 3000 */
app.listen(3000);
console.log('Server is running on :3000');
