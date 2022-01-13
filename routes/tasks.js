const express = require('express');
const router = express.Router();
const categoryAssigner = require('./tools/catAssign');
const categoryAssignerApi = require('./tools/catAssignAPI');

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

  router.post('/', (req, res) => {
    const text = req.body.text;
    const user_id = req.cookies.user_id;

    let category = categoryAssigner(text);
    if (!category) {
      categoryAssignerApi(text)
        .then((catInfo) => {
          if (catInfo.length > 0) {
            category = catInfo[0];
          } else {
            // default category is product
            category = 'product';
          }

          console.log('HERE', category)
          // Once category assigned, insert into db
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
              console.log('ADDED TO DB')
              res.send();
            })
            .catch((err) => {
              res.status(500).json({ error: err.message });
            });
        })
        .catch((err) => console.log(err.message));
    }
  });

  router.get('/:task_id', (req, res) => {
    const task_id = req.params.task_id;
    let query = `SELECT * FROM tasks WHERE id = $1`;
    db
      .query(query, [ task_id ])
      .then((data) => {
        const task = data.rows;
        res.json(task);
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
