// load .env data into process.env
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const database = require('./routes/database');

let { categories } = require('./seeds/constants');

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const app = express();
const morgan = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: 'session',
    keys: [ 'superUltraSpecialSecretKey' ],
    user_id: undefined
  })
);

app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false // false => scss, true => sass
  })
);

app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require('./routes/users');
const widgetsRoutes = require('./routes/widgets');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use('/api/users', usersRoutes(db));
app.use('/api/widgets', widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  let user_id = req.session.user_id;
  console.log(user_id);
  database.getTasksFromUserId(user_id).then((tasks) => {
    // for (let category in categories) {
    //   $(`.${category}`).append(`
    //   `)
    // }
    res.send(tasks);
  });
  // res.render('index');
});

// for logout
app.post('/logout', (req, res) => {
  res.render('index');
});

app.get('/tasks', (req, res) => {
  res.render('complete');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  let { email } = req.body; // FOR ACTUAL login form

  console.log(req.body.email);
  req.session.user_id = 2; // test different ids
  console.log('cookie set!');
  res.redirect('/');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  res.redirect('/');
});

// db tests
app.get('/get-all-tasks', (req, res) => {
  database.getAllTasks().then((tasks) => {
    console.log(tasks);
    res.send(tasks);
  });
});
app.get('/get-tasks-from-user-id/:id', (req, res) => {
  database.getTasksFromUserId(req.params.id).then((tasks) => {
    console.log(tasks);
    res.send(tasks);
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
