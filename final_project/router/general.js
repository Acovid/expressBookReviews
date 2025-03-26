const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Send JSON response with formatted books data
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Extract ISBN from URL parameter

    if (books[isbn]) {
        return res.status(200).json(books[isbn]); // Return book details
    } else {
        return res.status(404).json({ message: "Book not found" }); // If ISBN not found
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author; // Extract author from URL parameter
    let booksByAuthor = [];

    // Iterate through the books object
    Object.keys(books).forEach(key => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push(books[key]);
        }
    });

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor); // Return books by author
    } else {
        return res.status(404).json({ message: "No books found by this author" }); // If no books found
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title; // Extract author from URL parameter
    let booksByTitle = [];

    // Iterate through the books object
    Object.keys(books).forEach(key => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            booksByTitle.push(books[key]);
        }
    });

    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle); // Return books by author
    } else {
        return res.status(404).json({ message: "No books found by this title" }); // If no books found
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; // Extract ISBN from URL parameter

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews); // Return book reviews
    } else {
        return res.status(404).json({ message: "Book not found" }); // If ISBN not found
    }
});

module.exports.general = public_users;
