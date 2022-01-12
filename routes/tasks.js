const express = require('express');
const router = express.Router();
const categoryAssigner = require('./tools/catAssign');

module.exports = (db) => {
  router.get('/', (req, res) => {
    let query = `SELECT * FROM tasks`;
    console.log(query);
    db
      .query(query)
      .then((data) => {
        const tasks = data.rows;
        res.json(tasks);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post('/', (req, res) => {
    const text = req.body.text;
    const user_id = req.cookies.user_id;

    const category = categoryAssigner(text);

    db
      .query(
        `
    INSERT INTO tasks (
      description,
      category,
      date_created, user_id
    ) VALUES (
      $1,
      $2,
      NOW(),
      $3
    )
  `,
        [ text, category, user_id ]
      )
      .then((data) => {
        const tasks = data.rows;
        res.send();
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get('/by_user_id/:id', (req, res) => {
    const user_id = req.params.id;
    let query = `SELECT * FROM tasks WHERE user_id = $1`;
    console.log(query);
    db
      .query(query, [ user_id ])
      .then((data) => {
        const tasks = data.rows;
        res.json(tasks);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get('/complete', (req, res) => {
    let query = `SELECT * FROM tasks WHERE date_finished IS NOT NULL`;
    console.log(query);
    db
      .query(query)
      .then((data) => {
        const tasks = data.rows;
        res.json(tasks);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get('/incomplete', (req, res) => {
    let query = `SELECT * FROM tasks WHERE date_finished IS NULL`;
    console.log(query);
    db
      .query(query)
      .then((data) => {
        const tasks = data.rows;
        res.json(tasks);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get('/task-from-user/:id', (req, res) => {
    const id = req.params.id;
    let query = `SELECT * FROM tasks WHERE user_id = $1`;
    db
      .query(query, [ id ])
      .then((data) => {
        const tasks = data.rows;
        res.json({ tasks });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
