var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'xichtop99@gmail.com',
      pass: 'Xichtop26061999'
    }
  });

const SendMail = (email, subject, body) => {
    var mailOptions = {
        from: 'xichtop99@gmail.com',
        to: email,
        subject: subject,
        text: body
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = {
    SendMail
};