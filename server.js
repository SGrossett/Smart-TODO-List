// load .env data into process.env
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
app.use(bodyParser.json());

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

  database.insertIntoTasks(body.text, user_id).then((result) => {
    console.log(result);
  });
});

// todo rename to all-tasks
app.get('/all-tasks', (req, res) => {
  database.getAllTasks().then((tasks) => {
    console.log(tasks);
    // res.send(tasks);
    res.json(tasks);
  });
});

app.get('/completed', (req, res) => {
  database.getFinishedTasks()
  .then((task) => {
    console.log(task.rows);
    res.render('complete', { tasks: task.rows });
  });

  //res.json(task);
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
