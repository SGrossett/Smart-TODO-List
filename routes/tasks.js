const express = require('express');
const router = express.Router();

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
