import Database from "better-sqlite3";

const db = new Database("check.db");

// create table
db.exec(`
  CREATE TABLE IF NOT EXISTS test (
    id INTEGER PRIMARY KEY,
    name TEXT
  )
`);

// insert data
db.prepare("INSERT INTO test (name) VALUES (?)").run("it works");

// read data
const rows = db.prepare("SELECT * FROM test").all();
console.log(rows);
