const express = require('express');
const { resolve } = require('path');
const bodyParser = require('body-parser');
const data = require('./data.json');


const app = express();
const port = 3010;
app.use(bodyParser.json());

// Sample in-memory data to simulate a database
let books = [
  {
    book_id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    year: 1925,
    copies: 5,
  },
];

// **1. Create a New Book (C)**
app.post('/books', (req, res) => {
  const { book_id, title, author, genre, year, copies } = req.body;

  // Validation for required fields
  if (!book_id || !title || !author || !genre || !year || !copies) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Add the new book to the books array
  const newBook = { book_id, title, author, genre, year, copies };
  books.push(newBook);
  res.status(201).json(newBook);
});

// **2. Read Book Information (R)**

// Retrieve all books
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

// Retrieve a specific book by ID
app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const book = books.find((b) => b.book_id === id);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.status(200).json(book);
});

// **3. Update Book Information (U)**

app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, genre, year, copies } = req.body;

  // Find the book by its book_id
  let book = books.find((b) => b.book_id === id);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Update the book details
  book = { ...book, title, author, genre, year, copies };
  books = books.map((b) => (b.book_id === id ? book : b));

  res.status(200).json(book);
});

// **4. Delete a Book (D)**

app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const index = books.findIndex((b) => b.book_id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Remove the book from the array
  books.splice(index, 1);
  res.status(200).json({ message: 'Book deleted successfully' });
});

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
