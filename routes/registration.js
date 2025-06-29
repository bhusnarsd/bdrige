const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerEmployee, health } = require('../controllers/empController');
const authMiddleware = require('../middlewares/authMiddleware');

// Configure Multer for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: File type not supported!');
  },
});

router.get('/health', health);

// Routes for registration
router.get('/', authMiddleware, (req, res) => {
  res.render('register');  // Render the register.ejs file
});

router.post('/', authMiddleware, upload.single('profileImage'), registerEmployee);

module.exports = router;
