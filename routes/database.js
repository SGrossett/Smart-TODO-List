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

  module.exports = { getAllTasks, getTasksFromUserId };
