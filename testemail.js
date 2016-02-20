var nodemailer = require('nodemailer');

var smtpoption={ 
    host: 'smtp.office365.com',
    port: '587',
    auth: { user: 'MQ441@hk66.cf', pass: 'Ppassword123' },
    secureConnection: 'false',
    tls: { ciphers: 'SSLv3' }
};
var transporter = nodemailer.createTransport(smtpoption);


// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'MQ441@hk66.cf', // sender address
    to: 'hungchai08@yahoo.com.hk', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});