const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { logoutEmployee } = require('../controllers/empController');

// Routes for login
// router.get('/', (req, res) => {
//   res.render('login');  // Render the login.ejs file
// });

// router.post('/', loginEmployee);

router.post('/', logoutEmployee);

module.exports = router;
