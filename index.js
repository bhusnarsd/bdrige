require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const indexRoutes = require('./routes/index');
const flash = require('connect-flash');

const app = express();



const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('bridgessqldb_local', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });



// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'yourSecretKey',  // Use a strong secret
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,  // Set to true in production with HTTPS
    httpOnly: true   // Ensures the cookie is accessible only by the server
  }
}));

app.use(flash());

// Make session available to all views
app.use((req, res, next) => {
  console.log('Session user:', req.session.user); // Debug session here too
  res.locals.user = req.session.user;  // Make user info available in views
  next();
});

// Routes
app.use('/', indexRoutes);

// Sync database and start server
// db.sequelize.sync({ alter: true }).then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
// });

