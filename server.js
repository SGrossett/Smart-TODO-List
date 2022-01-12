const axios = require('axios').default;

// load .env data into process.env
const fake_data = require('./routes/fakedata');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const database = require('./routes/database');

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
app.use(bodyParser.json());

const usersRoutes = require('./routes/users');
const tasksRoutes = require('./routes/tasks');
app.use('/api/users', usersRoutes(db));
app.use('/api/tasks', tasksRoutes(db));

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  const user_id = req.session.user_id;
  axios
    .get(`http://localhost:8080/api/tasks/task-from-user/${user_id}`)
    .then((response) => {
      const tasks = response.data.tasks;
      res.render('index', { tasks });
    })
    .catch((err) => console.log(err.message));
});

app.get('/cookie_user_id', (req, res) => {
  const user_id = req.session.user_id;
  res.json(user_id);
});

// for logout
app.post('/logout', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  let { email } = req.body;

  database.getIdFromEmail(email).then((user_id) => {
    req.session.user_id = user_id;
    res.redirect('/');
  });
});

app.get('/register', (req, res) => {
  res.render('registration');
});

app.post('/register', (req, res) => {
  let { email } = req.body;
  database.addUserWithEmail(email).then((user_id) => {
    req.session.user_id = user_id;
    res.redirect('/');
  });
});

// --- API ROUTES -------------------------------------------------------------
app.get('/user-tasks', (req, res) => {
  let user_id = req.session.user_id;
  database.getTasksFromUserId(user_id).then((tasks) => {
    res.send(tasks);
  });
});

app.post('/user-tasks', (req, res) => {
  let user_id = req.session.user_id;
  const body = req.body;
  console.log('adding user tasks');

  database.insertIntoTasks(body.text, user_id).then((result) => {
    // console.log(result);
    res.send();
  });
});

// --- DEV API ROUTES (TEMPORARY - REMOVE ON PROJECT COMPLETION ) -------------
app.get('/get-tasks-from-user-id/:id', (req, res) => {
  database.getTasksFromUserId(req.params.id).then((tasks) => {
    console.log(tasks);
    res.send(tasks);
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
