var nodemailer = require('nodemailer');

class office365smtp
{
    constructor(userlogin, password)
    {
        this.userlogin = userlogin;
        this.password = password;
        this.smpt_option={
            host: 'smtp.office365.com',
            port: '587',
            auth: { user: this.userlogin, pass: this.password },
            secureConnection: 'false',
            tls: { ciphers: 'SSLv3' }
        };
    }

    sendMsg(to, subject, text, html)
    {
        var self = this;
        var transporter = nodemailer.createTransport(this.smtp_option);
        return function(callback)
        {
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return callback(error, null);
                }
                return callback(null, info);
            });
        }

    }


}

//var transporter = nodemailer.createTransport(smtp_option);
//
//
//// setup e-mail data with unicode symbols
//var mailOptions = {
//    from: 'MQ441@hk66.cf', // sender address
//    to: 'hungchai08@yahoo.com.hk', // list of receivers
//    subject: 'Hello ✔', // Subject line
//    text: 'Hello world 🐴', // plaintext body
//    html: '<b>Hello world 🐴</b>' // html body
//};
//
//// send mail with defined transport object
//transporter.sendMail(mailOptions, function(error, info){
//    if(error){
//        return console.log(error);
//    }
//    console.log('Message sent: ' + info.response);
//});