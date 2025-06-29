const express = require('express');
const router = express.Router();

// Import the login and registration routes
const loginHandler = require('../controllers/authMiddleware');  // Login logic
const authMiddleware = require('../middlewares/authMiddleware');  // Auth check
const logoutRoutes = require('./logout');
const registrationRoutes = require('./registration');  // Registration routes
const staffRoutes = require('./staff');
const adminRoutes = require('./admin');
const contract = require('./staffConfidentialityContract');
const hrRoutes = require('./hr');

// Public routes
router.get('/login', (req, res) => {
  res.render('login');  // Render the login page (you can use EJS, HTML, etc.)
});

router.post('/login', loginHandler);  // Login logic
router.use('/register', registrationRoutes);  // Registration form routes

// Routes
router.get('/', authMiddleware, (req, res) => res.render('index'));  // Home route
router.use('/staff', staffRoutes);
router.use('/admin', adminRoutes);
router.use('/hr', hrRoutes);
router.use('/contract', contract);


// Use the login and registration route modules
router.use('/logout', authMiddleware, logoutRoutes);


module.exports = router;