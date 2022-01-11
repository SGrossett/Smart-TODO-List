const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const getAllTasks = function() {
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

const insertIntoTasks = function (text) {
  return pool.query(`
    INSERT INTO tasks (
      description,
      date_created
    ) VALUES (
      $1,
      NOW()
    )
  `, [text])
  .then((result) => result)
  .catch((err) => console.log('Error:', err.message) );
}

module.exports = { getAllTasks, getTasksFromUserId, getIdFromEmail, addUserWithEmail, insertIntoTasks };
