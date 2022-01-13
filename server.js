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
  const user_id = req.cookies.user_id;
  if (user_id) {
    res.render('index');
  } else {
    res.redirect('/login');
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/');
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

app.get('/tasks/edit/:task_id', (req, res) => {
  const task_id = req.params.task_id;
  axios(`http://localhost:8080/api/tasks/${task_id}`)
    .then((task) => {
      res.send({ task });
    })
    .catch((err) => console.log('ERROR,', err.message));
});

app.get('/completed', (req, res) => {
  const user_id = req.cookies.user_id;
  if (user_id) {
    database.getFinishedTasks(user_id).then((task) => {
      res.render('complete', { tasks: task.rows });
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/incomplete', (req, res) => {
  console.log('in /incomplete');
  const user_id = req.cookies.user_id;
  if (user_id) {
    database.getIncompleteTasks(user_id).then((tasks) => {
      res.render('incomplete', { tasks: tasks.rows });
    });
  } else {
    res.redirect('/login');
  }
});

app.post('/updateToIncomplete', (req, res) => {
  console.log('going to update');
  let id = req.body.task_id;
  database.makeIncomplete(id);
  res.redirect('/completed');
});

app.post('/updateToFinished', (req, res) => {
  let id = req.body.task_id;
  database.markCompleted(id).then((result) => {
    res.redirect('/completed');
    return result;
  });
});

app.get('/edit-task/:task_id', (req, res) => {
  const task_id = req.params.task_id;
  database
    .getTaskFromId(task_id)
    .then((task) => {
      res.send(task); // todo replace with res.render('edit-task', {task}) when html complete
    })
    .catch((err) => console.log(err.message));
});

app.post('/edit-task/:task_id', (req, res) => {
  const task_id = req.params.task_id;
  const { task, category } = req.body;
  database
    .updateTask(task, category, task_id)
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      res.send(err.message);
    });
});

app.get('/edit-user', (req, res) => {
  console.log('in profile');
  // res.render('profile');

  const user_id = req.cookies.user_id;

  if (user_id) {
    database
      .getEmailFromId(user_id)
      .then((email) => {
        console.log({user_id, email})
        res.render('profile', { user_id, email });
      })
      .catch((err) => console.log(err));
  } else {
    res.redirect('/login');
  }
});

// app.post('/edit-user', (req, res) => {
//   console.log('email edit starting');

//   const user_id = req.cookies.user_id;
//   if (user_id) {
//     const email = req.body;
//     database
//       .updateUser(email, user_id) // <-----------------EDIT HERE------------
//       .then(() => {
//         // console.log(email);
//         // console.log(user_id);
//         res.redirect('/');
//       })
//       .catch((err) => {
//         res.send(err.message);
//       });
//   } else {
//     res.redirect('/login');
//   }
// });

app.post('/user-tasks/complete-task', (req, res) => {
  // console.log(req.body.id);
  database.addDateFinished(req.body.id).then((result) => {
    // console.log(result);
    res.send();
  });
})

// /* -------Edit Profile----------*/
/*
// EDIT GET REQ TO RENDER PAGE
app.get('/edit-user', (req, res) => {
  res.render('profile');
  console.log('in profile');
});
app.post('/edit-user', (req, res) => {
  console.log(req.body.email);
  database.updateUser(req.body.email).then((result) => {
    console.log(result);
    res.send();
  });
});
*/

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
