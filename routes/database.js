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

const getFinishedTasks = () => {
  console.log('In getFinishedTasks');

  return pool
    .query(`SELECT id, description, category FROM tasks WHERE date_finished IS NOT NULL ORDER BY date_finished DESC`)
    .then((result) => result)
    .catch((err) => err.message);
};
exports.getFinishedTasks = getFinishedTasks;

const getIncompleteTasks = () => {
  console.log('In getIncompleteTasks');

  return pool
    .query(`SELECT id, description, category FROM tasks WHERE date_finished IS NULL`)
    .then((result) => result)
    .catch((err) => err.message);
};
exports.getIncompleteTasks = getIncompleteTasks;

const makeIncomplete = async (id) => {
  const result = await pool.query(` UPDATE tasks SET date_finished = NULL WHERE id = $1`, [ id ]);
  // .then((result) => result)
  // .catch((err) => console.log('Error:', err.message));
  return result;
};
exports.makeIncomplete = makeIncomplete;

const markCompleted = (id) => {
  return (
    pool
      .query(` UPDATE tasks SET date_finished = NOW() WHERE id = $1`, [ id ])
      // .then((result) => result)
      .catch((err) => console.log('Error:', err.message))
  );
};
exports.markCompleted = markCompleted;
// exports.insertIntoTasks = insertIntoTasks;

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
