const { staffLoginDetails } = require('../models');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


exports.enquiryCreate = async (req, res) => {
  const { name, email } = req.body;
  const profileImage = req.file ? req.file.filename : null;
  const signatureImage = req.body.signature; // Assume this is base64

  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }

  try {
    // Generate random password and hash it
    // const password = generateRandomPassword();
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt rounds of 10
    const signatureImageName = `${Date.now()}-signature.png`;

    // Save base64 signature as a file
    const signaturePath = `public/uploads/signatures/${signatureImageName}`;
    if (signatureImage) {
      const buffer = Buffer.from(signatureImage.split(',')[1], 'base64');
      const signatureDir = path.dirname(signaturePath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(signatureDir)) {
        fs.mkdirSync(signatureDir, { recursive: true });
      }
      
      fs.writeFileSync(signaturePath, buffer);
    }

    // Validate profile image type (if file exists)
    if (req.file && req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpeg') {
      return res.status(400).send('Only PNG and JPEG images are allowed for profile image');
    }

    // Create user with hashed password
    const user = await staffLoginDetails.create({
      name,
      email,
      profileImage,
      signatureImage: signatureImageName || null,
      password: hashedPassword,  // Save the hashed password
    });

    // Send email with the generated password
    await sendWelcomeEmail(email, password);

    // Respond with the user data (excluding sensitive information like password)
    res.status(201).json({ user });

  } catch (err) {
    console.error('Error saving user data:', err);
    res.status(500).send('Error saving user data');
  }
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



  