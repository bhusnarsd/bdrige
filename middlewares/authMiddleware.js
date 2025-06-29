const { empLoginDetails } = require('../models');
const bcrypt = require('bcryptjs');

const authMiddleware = async (req, res, next) => {

        // If user is logged in (session exists), proceed
  if (req.session && req.session.user) {
    return next();
  }

  // If not logged in, redirect to the login page or respond with an error
  return res.redirect('/login');  // or res.status(401).send('Unauthorized');
      
  };
  
  module.exports = authMiddleware;
  