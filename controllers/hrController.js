const { staffLoginDetails } = require('../models');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


exports.kpiCreate = async (req, res) => {
  
};

// Send email after registration
const sendWelcomeEmail = async (email, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or use another SMTP service
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Welcome to our service',
      text: `Hello! Your account has been successfully created. Your password is: ${password}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};



  