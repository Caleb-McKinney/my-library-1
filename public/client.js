// Global variable to store current book ID
let currentBookId = null;

// DOM elements
const newBookForm = document.getElementById('newBookForm');
const bookTitleInput = document.getElementById('bookTitleInput');
const booksList = document.getElementById('booksList');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const bookDetailsSection = document.getElementById('bookDetailsSection');
const bookDetails = document.getElementById('bookDetails');
const addCommentForm = document.getElementById('addCommentForm');
const commentInput = document.getElementById('commentInput');
const deleteBookBtn = document.getElementById('deleteBookBtn');
const backToListBtn = document.getElementById('backToListBtn');

// Load all books on page load
document.addEventListener('DOMContentLoaded', function() {
  loadBooks();
});

// Add new book
newBookForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const title = bookTitleInput.value.trim();
  
  if (!title) {
    showMessage('Please enter a book title', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });
    
    const data = await response.json();
    
    if (data._id) {
      showMessage('Book added successfully!', 'success');
      bookTitleInput.value = '';
      loadBooks();
    } else {
      showMessage('Error adding book', 'error');
    }
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
  }
});

// Load all books
async function loadBooks() {
  try {
    const response = await fetch('/api/books');
    const books = await response.json();
    
    if (books.length === 0) {
      booksList.innerHTML = '<p class="no-comments">No books in the library yet. Add one above!</p>';
      return;
    }
    
    booksList.innerHTML = books.map(book => `
      <div class="book-item" onclick="loadBookDetails('${book._id}')">
        <span class="book-title">${escapeHtml(book.title)}</span>
        <span class="book-comments">${book.commentcount} comment${book.commentcount !== 1 ? 's' : ''}</span>
      </div>
    `).join('');
  } catch (error) {
    showMessage('Error loading books: ' + error.message, 'error');
  }
}

// Load book details
async function loadBookDetails(bookId) {
  currentBookId = bookId;
  
  try {
    const response = await fetch(`/api/books/${bookId}`);
    const data = await response.text();
    
    // Check if response is 'no book exists'
    if (data === 'no book exists') {
      showMessage('Book not found', 'error');
      return;
    }
    
    const book = JSON.parse(data);
    
    // Show book details section
    document.querySelector('.books-section').style.display = 'none';
    document.querySelector('.form-section').style.display = 'none';
    bookDetailsSection.style.display = 'block';
    
    // Display book details
    let commentsHtml = '';
    if (book.comments.length === 0) {
      commentsHtml = '<p class="no-comments">No comments yet. Be the first to add one!</p>';
    } else {
      commentsHtml = '<div class="comments-list">' + 
        book.comments.map(comment => 
          `<div class="comment-item">${escapeHtml(comment)}</div>`
        ).join('') + 
        '</div>';
    }
    
    bookDetails.innerHTML = `
      <h3 class="book-detail-title">${escapeHtml(book.title)}</h3>
      <p><strong>Book ID:</strong> ${book._id}</p>
      <p><strong>Comments (${book.comments.length}):</strong></p>
      ${commentsHtml}
    `;
  } catch (error) {
    showMessage('Error loading book details: ' + error.message, 'error');
  }
}

// Add comment to book
addCommentForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const comment = commentInput.value.trim();
  
  if (!comment) {
    showMessage('Please enter a comment', 'error');
    return;
  }
  
  try {
    const response = await fetch(`/api/books/${currentBookId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comment })
    });
    
    const data = await response.text();
    
    if (data === 'no book exists') {
      showMessage('Book not found', 'error');
      return;
    }
    
    showMessage('Comment added successfully!', 'success');
    commentInput.value = '';
    loadBookDetails(currentBookId);
  } catch (error) {
    showMessage('Error adding comment: ' + error.message, 'error');
  }
});

// Delete specific book
deleteBookBtn.addEventListener('click', async function() {
  if (!confirm('Are you sure you want to delete this book?')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/books/${currentBookId}`, {
      method: 'DELETE'
    });
    
    const result = await response.text();
    
    if (result === 'delete successful') {
      showMessage('Book deleted successfully!', 'success');
      backToList();
      loadBooks();
    } else {
      showMessage('Error deleting book', 'error');
    }
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
  }
});

// Delete all books
deleteAllBtn.addEventListener('click', async function() {
  if (!confirm('Are you sure you want to delete ALL books? This cannot be undone!')) {
    return;
  }
  
  try {
    const response = await fetch('/api/books', {
      method: 'DELETE'
    });
    
    const result = await response.text();
    
    if (result === 'complete delete successful') {
      showMessage('All books deleted successfully!', 'success');
      loadBooks();
    } else {
      showMessage('Error deleting books', 'error');
    }
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
  }
});

// Back to list
backToListBtn.addEventListener('click', backToList);

function backToList() {
  document.querySelector('.books-section').style.display = 'block';
  document.querySelector('.form-section').style.display = 'block';
  bookDetailsSection.style.display = 'none';
  currentBookId = null;
  commentInput.value = '';
  loadBooks();
}

// Show message
function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  
  document.querySelector('.container').insertBefore(messageDiv, document.querySelector('.container').firstChild);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
