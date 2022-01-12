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

  router.post('/', (req, res) => {
    const text = req.body.text;
    const user_id = req.cookies.user_id;

    console.log('task:', text, ', user_id:', user_id);
    const allKeyWords = [
      'movie',
      'watch',
      'show',
      'drama',
      'Netflix',
      'Hulu',
      'Disney',
      'HBO',
      'cartoon',
      'anime',
      'Crunchyroll',
      'cable',
      'restaurant',
      'dinner',
      'eat',
      'takeout',
      'food',
      'menu',
      'dine',
      'lunch',
      'brunch',
      'drink',
      'tea',
      'bar',
      'cafe',
      'book',
      'read',
      'library',
      'more',
      'buy'
    ];

    let keyWord = '';
    for (let word of allKeyWords) {
      if (text.toLowerCase().includes(word.toLowerCase())) {
        keyWord = word;
        break;
      } else {
        keyWord = '';
      }
    }

    const categoryKeys = {
      movie: [
        'movie',
        'watch',
        'show',
        'drama',
        'Netflix',
        'Hulu',
        'Disney',
        'HBO',
        'cartoon',
        'anime',
        'Crunchyroll',
        'cable'
      ],
      restaurant: [
        'restaurant',
        'dinner',
        'eat',
        'takeout',
        'food',
        'menu',
        'dine',
        'lunch',
        'brunch',
        'drink',
        'tea',
        'bar',
        'cafe'
      ],
      book: [ 'book', 'read', 'library' ],
      product: [ 'more', 'buy' ]
    };

    let category = '';
    if (categoryKeys['movie'].includes(keyWord)) category = 'movie';
    if (categoryKeys['restaurant'].includes(keyWord)) category = 'restaurant';
    if (categoryKeys['book'].includes(keyWord)) category = 'book';
    if (categoryKeys['product'].includes(keyWord)) category = 'product';

    if (!category) {
      category = 'product';
    }

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
