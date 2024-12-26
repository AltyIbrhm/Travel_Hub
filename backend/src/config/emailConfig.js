const nodemailer = require('nodemailer');

const emailConfig = {
  smtp: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  },
  from: process.env.EMAIL_USER,
  templates: {
    resetPassword: {
      subject: 'Password Reset Request',
      generateHtml: (userName, resetUrl) => `
        <h1>Password Reset Request</h1>
        <p>Hi ${userName},</p>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    },
    welcome: {
      subject: 'Welcome to TravelHub',
      generateHtml: (userName) => `
        <h1>Welcome to TravelHub!</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for joining TravelHub. We're excited to have you on board!</p>
        <p>If you have any questions, feel free to contact our support team.</p>
      `
    }
  }
};

const transporter = nodemailer.createTransport(emailConfig.smtp);

module.exports = {
  emailConfig,
  transporter
};