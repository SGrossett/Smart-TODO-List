/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    db
      .query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get('/userEmail', (req, res) => {
    const user_id = req.cookies.user_id;
    console.log('user_id', user_id);
    db
      .query(`SELECT * FROM users WHERE id = $1;`, [ user_id ])
      .then((data) => {
        const email = data.rows[0].email;
        res.json( email );
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
