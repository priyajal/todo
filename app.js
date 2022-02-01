const express = require("express");

const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
app.use(express.json());
module.exports = app;
let dbPath = path.join(__dirname, "todoApplication.db");
let db = null;

const initializeDbServer = async (request, response) => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Started");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

initializeDbServer();

//API GET TODOS

app.get("/todos/", async (request, response) => {
  try {
    const { status = "", priority = "", search_q = "" } = request.query;

    const getTodosQuery = `
  select
  *
  from 
  todo
  where status LIKE '%${status}%' AND priority LIKE '%${priority}%'  AND todo LIKE '%${search_q}%'
  `;

    const getTodos = await db.all(getTodosQuery);
    response.send(getTodos);
  } catch (e) {
    console.log(e.message);
  }
});

//API GET PARTICULAR API
app.get("/todos/:todoId/", async (request, response) => {
  try {
    const { todoId } = request.params;
    const getTodosQuery = `
  select
  *
  from 
  todo
  where id = ${todoId}
  `;

    const getTodos = await db.get(getTodosQuery);
    response.send(getTodos);
  } catch (e) {
    console.log(e.message);
  }
});

//API POST API
app.post("/todos/", async (request, response) => {
  try {
    const { id, todo, priority, status } = request.body;
    const getTodosQuery = `
  insert into todo(id,todo,priority,status)
  values(${id},'${todo}','${priority}','${status}')
  `;

    await db.run(getTodosQuery);
    response.send("Todo Successfully Added");
  } catch (e) {
    console.log(e.message);
  }
});
//API UPDATE
app.put("/todos/:todoId/", async (request, response) => {
  try {
    const { todoId } = request.params;
    const { priority, status, todo } = request.body;
    if (priority != undefined) {
      const getTodosQuery = `
        update
        todo
        set priority = '${priority}'
  `;
      await db.run(getTodosQuery);
      response.send("Priority Updated");
    }
    if (status !== undefined) {
      const getTodosQuery = `
  update
  todo
  set status = '${status}'
  `;
      await db.run(getTodosQuery);
      response.send("Status Updated");
    }
    if (todo !== undefined) {
      const getTodosQuery = `
  update
  todo
  set todo = '${todo}'
  `;
      await db.run(getTodosQuery);
      response.send("Todo Updated");
    }
  } catch (e) {
    console.log(e.message);
  }
});

//API DELETE
app.delete("/todos/:todoId/", async (request, response) => {
  try {
    const { todoId } = request.params;
    const getTodosQuery = `
  DELETE
  from
  todo
  where id = ${todoId}
  `;

    await db.run(getTodosQuery);
    response.send("Todo Deleted");
  } catch (e) {
    console.log(e.message);
  }
});
