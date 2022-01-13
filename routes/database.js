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

const getFinishedTasks = (user_id) => {
  console.log('In getFinishedTasks');

  return pool
    .query(
      `SELECT id, description, category FROM tasks WHERE user_id = $1 AND date_finished IS NOT NULL ORDER BY date_finished DESC`,
      [ user_id ]
    )
    .then((result) => result)
    .catch((err) => err.message);
};
exports.getFinishedTasks = getFinishedTasks;

const getIncompleteTasks = (user_id) => {
  console.log('In getIncompleteTasks');

  return pool
    .query(`SELECT id, description, category FROM tasks WHERE user_id = $1 AND date_finished IS NULL`, [ user_id ])
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
    .query(
      `
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


// // NEW edit function - UPDATE email from users
// const updateEmail = function(id, email) {
//   return pool
//     .query(`
//       UPDATE users
//       SET email = $2
//       WHERE id = $1
//       `,
//       [ id, email ] // CHECK IF EMAIL BEING CALLED CORRECTLY
//     )
//     .then((result) => result)
//     .catch((err) => console.log('Error:', err.message));
// };
// exports.updateEmail = updateEmail;


const updateTask = function(task, category, id) {
  return pool
    .query(
      `
      UPDATE tasks
      SET
      description = $1,
      category = $2
      WHERE id = $3
      `,
      [ task, category, id ]
    )
    .then((result) => result)
    .catch((err) => console.log('Error:', err.message));
};
exports.updateTask = updateTask;

const updateUser = function(email, id) {
  return pool
    .query(
      `
      UPDATE users
      SET
      email = $1
      WHERE id = $2
      `,
      [ email, id ]
    )
    .then((result) => result)
    .catch((err) => console.log('Error:', err.message));
};
exports.updateUser = updateUser;

const getTaskFromId = function(task_id) {
  return pool
    .query(
      `
      SELECT *
      FROM tasks
      WHERE id = $1
      `,
      [ task_id ]
    )
    .then((task) => {
      return task.rows[0];
    })
    .catch((err) => console.log('Error:', err.message));
};
exports.getTaskFromId = getTaskFromId;

const getEmailFromId = function(user_id) {
  return pool
    .query(
      `
      SELECT email
      FROM users
      WHERE id = $1
      `,
      [ user_id ]
    )
    .then((email) => email.rows[0].email)
    .catch((err) => console.log('Error:', err.message));
};
exports.getEmailFromId = getEmailFromId;
