const { StaffLoginDetails } = require('../models');
const bcrypt = require('bcryptjs');

const loginHandler = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      // return res.status(400).send('Email and password are required');
      return res.render('login', { errorMessage: 'Email and password are required' });
    }
  
    try {
      // Find user by email
      const user = await StaffLoginDetails.findOne({ where: { email } });
  
      if (!user) {
        // return res.status(400).send('Invalid email or password');
        return res.render('login', { errorMessage: 'Invalid email or password' });
      }
  
      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        // return res.status(400).send('Invalid email or password');
        return res.render('login', { errorMessage: 'Invalid email or password' });
      }

      req.session.user = { id: user.id, name: user.name, email: user.email };
      console.log('Setting session for user:', { email: req.session.user.email }); // Debug session set
  
      // Respond with a success message and user data (excluding password)
    //   res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
    // res.render('index')
    
    // Redirect to the home page after setting session
    return res.redirect('/');  // Redirect to '/' instead of rendering index
  
    } catch (err) {
      console.error('Error during login:', err);
      // return res.status(500).send('Error during login');
      return res.render('login', { errorMessage: 'Error during login' });
    }
  };

  module.exports = loginHandler;