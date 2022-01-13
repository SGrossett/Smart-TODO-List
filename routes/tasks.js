const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
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

  router.get('/by_user_id/:id', (req, res) => {
    const user_id = req.params.id;
    let query = `SELECT * FROM tasks WHERE user_id = $1 AND date_finished IS NULL`;
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
    let query = `SELECT * FROM tasks WHERE user_id = $1 AND date_finished IS NULL`;
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

  // router.get('/user-tasks')
  return router;
};
