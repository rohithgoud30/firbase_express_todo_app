const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendResetEmail = (to, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Password Reset',
    text: `Please use the following link to reset your password: ${resetLink}`,
    html: `<p>Please use the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
  }

  return transporter.sendMail(mailOptions)
}

module.exports = { sendResetEmail }
