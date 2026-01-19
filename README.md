# Personal Library

This is the boilerplate for the Personal Library project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/personal-library

## Setup

- Install dependencies:

```bash
npm install
```

- Environment variables: create a `.env` file with:

```bash
NODE_ENV=test
# Optional: uncomment and set your MongoDB connection string
# DB=mongodb://user:pass@host:port/database
```

If `DB` is not set, the app uses an in-memory store suitable for local testing.

## Run

```bash
npm start
```

The server starts on `http://localhost:3000`. When `NODE_ENV=test` is set, functional tests run automatically on startup.

## API

- `GET /api/books` → list all books `{ _id, title, commentcount }[]`
- `POST /api/books` with `title` → create book → `{ _id, title }`
- `DELETE /api/books` → delete all → `complete delete successful`
- `GET /api/books/:id` → `{ _id, title, comments: [] }` or `no book exists`
- `POST /api/books/:id` with `comment` → updated book or `missing required field comment`/`no book exists`
- `DELETE /api/books/:id` → `delete successful` or `no book exists`

## Using Your GitHub Repo

To use this code in your repo at `https://github.com/Caleb-McKinney/my-library-1.git`:

1. Clone your repo locally:
	```bash
	git clone https://github.com/Caleb-McKinney/my-library-1.git
	cd my-library-1
	```
2. Copy the project files from this folder into your repo folder (overwrite `routes/api.js`, `tests/2_functional-tests.js`, update `package.json`, and add `.env`).
3. Install dependencies and run:
	```bash
	npm install
	npm start
	```
4. Commit and push:
	```bash
	git add -A
	git commit -m "Implement personal library API and tests"
	git push
	```

## Links

- Solution link: `http://localhost:3000/`
- Source code link: `https://github.com/Caleb-McKinney/my-library-1`
