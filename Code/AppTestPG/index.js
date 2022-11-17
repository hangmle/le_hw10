const express = require("express");
const path = require("path");
// Declare the node-postgres module
const { Pool } = require("pg");

// Creating the Express server
const app = express();

// Connection to the PostgreSQL database
const pool = new Pool({
  user: "mnipatvr",
  host: "heffalump.db.elephantsql.com",
  database: "mnipatvr",
  password: "haujzJgEr4WW7liI9XLO2dutCHh_K3Rz",
  port: 5432
});
console.log("Successful connection to the database");


// Creating a "Books" table
const sql_create = `CREATE TABLE IF NOT EXISTS Books (
  Book_ID SERIAL PRIMARY KEY,
  Title VARCHAR(100) NOT NULL,
  Author VARCHAR(100) NOT NULL,
  Comments TEXT
);`;

pool.query(sql_create, [], (err, result) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'Books' table");
});

// Seeding the "Books" table
console.log("Successful creation of the 'Books' table");
// Database seeding
const sql_insert = `INSERT INTO Books (Book_ID, Title, Author, Comments) VALUES
  (1, 'Mrs. Bridge', 'Evan S. Connell', 'First in the serie'),
  (2, 'Mr. Bridge', 'Evan S. Connell', 'Second in the serie'),
  (3, 'L''ingénue libertine', 'Colette', 'Minne + Les égarements de Minne')
ON CONFLICT DO NOTHING;`;
pool.query(sql_insert, [], (err, result) => {
  if (err) {
    return console.error(err.message);
  }
  const sql_sequence = "SELECT SETVAL('Books_Book_ID_Seq', MAX(Book_ID)) FROM Books;";
  pool.query(sql_sequence, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of 3 books");
  });
});


//
app.listen(3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});

// GET /
app.get("/", (req, res) => {
  //res.send ("Hello world...");
  res.render("index");
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Add the /about path
// answer the request to /about
app.get("/about", (req, res) => {
  res.render("about");
});


// Send data from the server to the view
// add a function to take into account the URL "/data" and render the corresponding view, by adding the object to be transmitted to it
app.get("/data", (req, res) => {
  const test = {
    title: "Test",
    items: ["one", "two", "three"]
  };
  res.render("data", { model: test });
});

// Display the list of books
app.get("/books", (req, res) => {
  const sql = "SELECT * FROM Books ORDER BY Title"
  pool.query(sql, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("books", { model: result.rows });
  });
});