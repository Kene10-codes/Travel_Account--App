const functions = require ('firebase-functions');
const admin = require ('firebase-admin');
const nodemailer = require ('nodemailer');

admin.initializeApp ();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport ({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'apikey', // generated  user
    pass: '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', // generated sendgrid api password
  },
});

export const sendEmail = functions.https.onRequest ((request, response) => {
  const from = request.query.from;
  const message = request.query.message;

  const mailOptions = {
    from: 'kenechukwucoach@gmail.com',
    to: 'kenechukwcoach@gmail.com',
    subject: 'Hi, hope you got our message',
    html: `${message} <br><br> from ${from}`,
  };

  transporter.sendMail (mailOptions, (error, info) => {
    if (error) {
      console.log (
        `Error: (email) - ${from} -- (message) ${message} -- (error) ${error.oString ()}`
      );
      response.send (error.toString ());
    }
    response.send ('Your message was sent successfully');
  });
});
