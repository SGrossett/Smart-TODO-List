const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const getAllTasks = function () {
  return pool
    .query(`SELECT * FROM tasks`)
    .then((tasks) => {
      if (tasks.rows) {
        return tasks.rows;
      } else {
        return null;
      }
    })
    .catch((err) => console.log(err.message));
};
exports.getAllTasks = getAllTasks

const getTasksFromUserId = function(user_id) {
  return pool
    .query(
      `
    SELECT * FROM tasks
    JOIN users ON tasks.user_id = users.id
    WHERE $1 = tasks.user_id
    `,
      [ user_id ]
    )
    .then((tasks) => {
      if (tasks.rows) {
        return tasks.rows;
      } else {
        return null;
      }
    })
    .catch((err) => console.log(err.message));
};
exports.getTasksFromUserId = getTasksFromUserId

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
exports.getIdFromEmail = getIdFromEmail

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
exports.addUserWithEmail = addUserWithEmail

const insertIntoTasks = function (text, user_id) {
  const task = text;
  console.log('task:', task)
  const allKeyWords = [
    'movie',      'watch',       'show',
    'drama',      'Netflix',     'Hulu',
    'Disney',     'HBO',         'cartoon',
    'anime',      'Crunchyroll', 'cable',
    'restaurant', 'dinner',      'eat',
    'takeout',    'food',        'menu',
    'dine',       'lunch',       'brunch',
    'drink',      'tea',         'bar',
    'cafe',       'book',        'read',
    'library',    'more',        'buy'
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
    movie: ['movie', 'watch', 'show', 'drama', 'Netflix', 'Hulu', 'Disney', 'HBO', 'cartoon', 'anime', 'Crunchyroll', 'cable'],
    restaurant: ['restaurant', 'dinner', 'eat', 'takeout', 'food', 'menu', 'dine', 'lunch', 'brunch', 'drink', 'tea', 'bar', 'cafe'],
    book: ['book', 'read', 'library'],
    product: ['more', 'buy']
  }

  let category = '';
  if (categoryKeys['movie'].includes(keyWord)) category = 'movie';
  if (categoryKeys['restaurant'].includes(keyWord)) category = 'restaurant';
  if (categoryKeys['book'].includes(keyWord)) category = 'book';
  if (categoryKeys['product'].includes(keyWord)) category = 'product';


  if (!category) {
    category = 'product'
  }
  
  return pool.query(`
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
  `, [text, category, user_id])
  .then((result) => result)
  .catch((err) => console.log('Error:', err.message) );
}
exports.insertIntoTasks = insertIntoTasks
