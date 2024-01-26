const nodemailer = require('nodemailer');

const sendEmail = async (option) =>{
   //create a transporter instance
   const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
   })

   //define email options
   const emailOptions = {
    from: 'YouTrack Support<youtrackhelpcenter@gmail.com>',
    to: option.email,
    subject: option.subject,
    text: option.message
   };

  await transporter.sendMail(emailOptions)
}

module.exports = sendEmail;