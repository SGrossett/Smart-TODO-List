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

  // NEW ADDITIONS
  router.get('/user-tasks', (req, res) => {
    let user_id = req.session.user_id;
    database.getTasksFromUserId(user_id).then((tasks) => {
      res.send(tasks);
    });
  });

  router.post('/user-tasks', (req, res) => {
    let user_id = req.session.user_id;
    const body = req.body;
    console.log('adding user tasks');

    database.insertIntoTasks(body.text, user_id).then((result) => {
      // console.log(result);
      res.send();
    });
  });

  // todo rename to all-tasks
  router.get('/all-tasks', (req, res) => {
    database.getAllTasks().then((tasks) => {
      console.log(tasks);
      // res.send(tasks);
      res.json(tasks);
    });
  });
  return router;
};
