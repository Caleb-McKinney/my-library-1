'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*' })); // For FCC testing purposes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static(process.cwd() + '/public'));

// In-memory storage for books (array of book objects)
let books = [];
let nextId = 1;

// Index page
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// API routes

// Get all books or create a new book
app.route('/api/books')
  .get(function (req, res) {
    // Return array of all books with commentcount
    const booksWithCommentCount = books.map(book => ({
      _id: book._id,
      title: book.title,
      commentcount: book.comments.length
    }));
    res.json(booksWithCommentCount);
  })
  
  .post(function (req, res) {
    const title = req.body.title;
    
    if (!title) {
      res.send('missing required field title');
      return;
    }
    
    // Create new book
    const newBook = {
      _id: String(nextId++),
      title: title,
      comments: []
    };
    
    books.push(newBook);
    res.json({ _id: newBook._id, title: newBook.title });
  })
  
  .delete(function(req, res) {
    // Delete all books
    books = [];
    res.send('complete delete successful');
  });

// Get, update, or delete a specific book
app.route('/api/books/:id')
  .get(function (req, res) {
    const bookId = req.params.id;
    const book = books.find(b => b._id === bookId);
    
    if (!book) {
      res.send('no book exists');
      return;
    }
    
    res.json({
      _id: book._id,
      title: book.title,
      comments: book.comments
    });
  })
  
  .post(function(req, res) {
    const bookId = req.params.id;
    const comment = req.body.comment;
    
    if (!comment) {
      res.send('missing required field comment');
      return;
    }
    
    const book = books.find(b => b._id === bookId);
    
    if (!book) {
      res.send('no book exists');
      return;
    }
    
    book.comments.push(comment);
    
    res.json({
      _id: book._id,
      title: book.title,
      comments: book.comments
    });
  })
  
  .delete(function(req, res) {
    const bookId = req.params.id;
    const bookIndex = books.findIndex(b => b._id === bookId);
    
    if (bookIndex === -1) {
      res.send('no book exists');
      return;
    }
    
    books.splice(bookIndex, 1);
    res.send('delete successful');
  });

// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, function () {
  console.log('Listening on port ' + port);
});

module.exports = app; // For testing
