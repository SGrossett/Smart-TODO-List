const axios = require('axios').default;
const cookieParser = require('cookie-parser');

// load .env data into process.env
const fake_data = require('./routes/fakedata');
require('dotenv').config();
const bodyParser = require('body-parser');

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
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

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
  res.render('index');
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
    res.cookie('user_id', user_id);
    res.redirect('/');
  });
});

app.get('/register', (req, res) => {
  res.render('registration');
});

app.post('/register', (req, res) => {
  let { email } = req.body;
  database.addUserWithEmail(email).then((user_id) => {
    res.cookie('user_id', user_id);
    res.redirect('/');
  });
});

app.get('/tasks/:task_id', (req, res) => {
  const task_id = req.params.task_id;
  axios(`http://localhost:8080/api/tasks/${task_id}`)
    .then((task) => {
      res.send({ task });
    })
    .catch((err) => console.log('ERROR,', err.message));
});

app.get('/completed', (req, res) => {
  database.getFinishedTasks()
  .then((task) => {
    res.render('complete', {tasks: task.rows});
  });
});

app.get('/incomplete', (req, res) => {
  console.log('in /incomplete');
  database.getIncompleteTasks()
  .then((task) => {
    res.render('incomplete', {tasks: task.rows});
  });
});

app.post('/updateToIncomplete', (req, res) => {
  console.log('going to update')
  let id  = req.body.task_id;
  database.makeIncomplete(id)
  res.redirect('/completed');
});

app.post('/updateToFinished', (req, res) => {
  let id  = req.body.task_id;
  database.markCompleted(id)
  .then((result) => {
    res.redirect('/completed')
    return result;
  });
});
// --- API ROUTES -------------------------------------------------------------
app.post('/user-tasks/delete', (req, res) => {
  console.log(req.body.id);
  database.addDateFinished(req.body.id).then((result) => {
    console.log(result);
    res.send();
  });
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
