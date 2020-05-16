const nodemailer = require('nodemailer')

module.exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vishuchhabraabohariya@gmail.com',
      pass: '1016594680'
    } 
  });