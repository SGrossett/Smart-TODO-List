const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const getIdFromEmail = function(email) {
  return pool
    .query(
      `
  SELECT id FROM users
  WHERE email = $1
  ;
  `,
      [ email ]
    )
    .then((result) => {
      return result.rows[0].id;
    });
};
exports.getIdFromEmail = getIdFromEmail;

const addUserWithEmail = function(email) {
  return pool
    .query(
      `
      INSERT INTO users (email)
      VALUES ($1)
      RETURNING *;
    `,
      [ email ]
    )
    .then((email) => {
      return email.rows[0].id;
    });
};
exports.addUserWithEmail = addUserWithEmail;

const insertIntoTasks = function(text, user_id) {
  const task = text;
  console.log('task:', task);
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
    if (task.toLowerCase().includes(word.toLowerCase())) {
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

  return pool
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
    .then((result) => result)
    .catch((err) => console.log('Error:', err.message));
};
exports.insertIntoTasks = insertIntoTasks;

// NEW delete function - ADD end date to db
const addDateFinished = function(id) {
  return pool
    .query(`
      UPDATE tasks
      SET date_finished = NOW()
      WHERE id = $1
      `,
      [ id ]
    )
    .then((result) => result)
    .catch((err) => console.log('Error:', err.message));
};
exports.addDateFinished = addDateFinished;
