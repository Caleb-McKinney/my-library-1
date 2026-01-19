# Personal Library

A personal library management system built as part of the FreeCodeCamp Quality Assurance certification.

## Description

This application allows users to manage a personal library by adding books, viewing book details, adding comments to books, and deleting books. It includes a RESTful API and a user-friendly web interface.

## Features

- Add new books to the library
- View all books with comment counts
- View individual book details with all comments
- Add comments to books
- Delete individual books
- Delete all books from the library

## API Endpoints

### Books Collection
- **GET** `/api/books` - Returns an array of all books with comment counts
- **POST** `/api/books` - Creates a new book (requires `title` in request body)
- **DELETE** `/api/books` - Deletes all books

### Individual Book
- **GET** `/api/books/:id` - Returns a single book with all comments
- **POST** `/api/books/:id` - Adds a comment to a book (requires `comment` in request body)
- **DELETE** `/api/books/:id` - Deletes a specific book

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file based on `.env.example`
4. Start the server:
   ```bash
   npm start
   ```

## Testing

Run the functional tests:
```bash
npm test
```

## Technologies Used

- Node.js
- Express.js
- Mocha & Chai (for testing)
- HTML/CSS/JavaScript (frontend)

## Project Structure

```
.
├── server.js           # Main server file with API routes
├── package.json        # Project dependencies and scripts
├── views/
│   └── index.html     # Main HTML page
├── public/
│   ├── style.css      # Styles
│   └── client.js      # Client-side JavaScript
└── tests/
    └── 2_functional-tests.js  # Functional tests
```

## License

MIT
