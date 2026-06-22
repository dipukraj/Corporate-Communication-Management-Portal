const nodemailer = require('nodemailer');
const ActivityLog = require('../models/ActivityLog');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured. Skipping email send.');
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
};

const sendUploadNotification = async (user, content) => {
  await sendEmail({
    to: user.email,
    subject: 'Content Uploaded Successfully - CMS Portal',
    html: `
      <h2>Upload Successful</h2>
      <p>Hello ${user.name},</p>
      <p>Your content "<strong>${content.title}</strong>" has been uploaded successfully.</p>
      <p><strong>Category:</strong> ${content.category}</p>
      <p><strong>Status:</strong> ${content.status}</p>
      <p>Thank you for using CMS Portal.</p>
    `,
  });
};

const logActivity = async (userId, action, details = '', entityType = '', entityId = null) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      details,
      entityType,
      entityId,
    });
  } catch (error) {
    console.error('Activity log failed:', error.message);
  }
};

module.exports = { sendEmail, sendUploadNotification, logActivity };
