/*
 * All routes for Tables are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
// add routes from server.js, then import to server with:
// app.use('/api/tables', tasksRoutes(db));


const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // logout
  router.post('/logout', (req, res) => {
    res.render('index');
  });

  // login
  router.get('/login', (req, res) => {
    res.render('login');
  });
  router.post('/login', (req, res) => {
    let { email } = req.body;

    database.getIdFromEmail(email).then((user_id) => {
      req.session.user_id = user_id;
      res.redirect('/');
    });
  });

  // register
  router.get('/register', (req, res) => {
    res.render('registration');
  });
  router.post('/register', (req, res) => {
    let { email } = req.body;
    database.addUserWithEmail(email).then((user_id) => {
      req.session.user_id = user_id;
      res.redirect('/');
    });
  });
  return router;
}


