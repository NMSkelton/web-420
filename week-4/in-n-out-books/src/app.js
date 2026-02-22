// Name: Nicholas Skelton
// Date: 2/1/26
// File: app.js
// Description: In-N-Out Books

const express = require("express");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const books = require("../database/books");

const app = express(); // Creates an Express application

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {

  // HTML content for the landing page
  const html = `
  <html>
    <head>
      <title>In-N-Out-Books</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Goudy+Bookletter+1911&display=swap" rel="stylesheet">
      <style>
        body, h1, h2, h3, p {
          margin: 0;
          padding: 0;
          border: 0;
        }
        body {
          background: #bdbdbd;
          color: #333333;
          margin: 1rem;
          font-family: serif;
          line-height: 1.6;
        }
        h1, h2, h3 {
          color: #4726ff;
          font-family: "Goudy Bookletter 1911", cursive;
          weight: 100;
        }
        .section.hours, .section.contact {
          text-align: center;
        }
        h1, h2 {
          text-align: center;
          margin-bottom: 1rem;
        }
        h3 {
          margin-top: 0.5rem;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
          background: #ebebeb;
          border-radius: 8px;
        }
        .section {
          margin-bottom: 2rem;
        }
        .books .book {
          border: 3px solid #4726ff;
          padding: 1rem;
          margin: 0.5rem 0;
          border-radius: 4px;
        }
        footer {
          text-align: center;
          font-size: 0.9rem;
          margin-top: 2rem;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">

        <!-- Introduction -->
        <section class="section introduction">
          <h1>In-N-Out-Books</h1>
          <p>
            Welcome to In-N-Out Books, where reading is our passion. If you're looking for a space to home your virtual library, get book recommendations, or find the next great read for your book club - then look no further! We are your one-stop-shop for everything books!
          </p>
        </section>

        <!-- Top Selling Books -->
        <section class="section books">
          <h2>Top Selling Books</h2>
          <div class="book">
            <h3>The Lord of the Rings</h3>
            <p>Author: J. R. R. Tolkien</p>
            <p>Genre: High Fantasy</p>
          </div>
          <div class="book">
            <h3>Jurassic Park</h3>
            <p>Author: Michael Crichton</p>
            <p>Genre: Science Fiction</p>
          </div>
          <div class="book">
            <h3>The Ice Limit</h3>
            <p>Author: Douglas Preston & Lincoln Child</p>
            <p>Genre: Techno-Thriller</p>
          </div>
        </section>

        <!-- Hours of Operation -->
        <section class="section hours">
          <h2>Hours of Operation</h2>
          <p>Monday - Friday: 9am - 8pm</p>
          <p>Saturday: 10am - 6pm</p>
          <p>Sunday: Closed</p>
        </section>

        <!-- Contact Information -->
        <section class="section contact">
          <h2>Contact Information</h2>
          <p>Email: info@in-n-out-books.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 12345 Madison Ave, New York, NY 10024</p>
        </section>

      </div>
    </body>
  </html>
  `; // end HTML content for the landing page

  res.send(html); // Sends the HTML content to the client
});

app.get("/api/books", async (req, res, next) => {
  try {

    const allBooks = await books.find();

    console.log("All Books: ", allBooks);
    res.send(allBooks);

  } catch (err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

app.get("/api/books/:id", async (req, res, next) => {
  try {

    let { id } = req.params;
    id = parseInt(id);

    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }

    const book = await books.findOne({ id: id });

    console.log("Book: ", book);
    res.send(book);

  } catch (err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

app.post("/api/books", async (req, res, next) => {
  try {
    const newBook = req.body;

    const expectedKeys = ["id", "title", "author"];

    const receivedKeys = Object.keys(newBook);

    if (!receivedKeys.every(key => expectedKeys.includes(key)) || receivedKeys.length !== expectedKeys.length) {
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      return next(createError(400, "Bad Request"));
    }

    const result = await books.insertOne(newBook);

    console.log("Result: ", result);
    res.status(201).send({ id: result.ops[0].id});

  } catch (err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

app.delete("/api/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await books.deleteOne({ id: parseInt(id) });

    console.log("Result: ", result);
    res.status(204).send();

  } catch (err) {
    if (err.message === "No matching item found") {
      return next(createError(404, "Book not found"));
    }

    console.error("Error: ", err.message);
    next(err);
  }
});

app.put("/api/books/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let book = req.body;
    id = parseInt(id);
    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }

    const expectedKeys = ["title", "author"];
    const receivedKeys = Object.keys(book);

    if (!receivedKeys.every(key => expectedKeys.includes(key)) || receivedKeys.length !== expectedKeys.length) {
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);

      return next(createError(400, "Bad Request"));

    }
    const result = await books.updateOne({ id: id }, book);

    console.log("Result: ", result);
    res.status(204).send();

  } catch (err) {
    if (err.message === "No matching item found") {

      console.log("Book not found", err.message)
      return next(createError(404, "Book not found"));
    }

    console.error("Error: ", err.message);
    next(err);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
    });
});

module.exports = app;