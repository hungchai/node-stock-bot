var nodemailer = require('nodemailer');

var smtpoption={ 
    host: 'smtp.office365.com',
    port: '587',
    auth: { user: 'tomma2-c@my.cityu.edu.hk', pass: 'C00ovujM' },
    secureConnection: 'false',
    tls: { ciphers: 'SSLv3' }
};
var transporter = nodemailer.createTransport(smtpoption);


// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'hungchai08@hotmail.com', // sender address
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