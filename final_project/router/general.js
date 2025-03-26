const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios'); // Include axios for asynchronous calls
const public_users = express.Router();

// Mock a route to simulate an external API endpoint that returns books data
const booksApiUrl = "http://localhost:5000/api/books"; // Simulate the API URL

public_users.post("/register", (req,res) => {
    const { username, password } = req.body; // Extract username & password from request body

    // Check if username & password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop - SYNCHRONOUS
public_users.get('/',function (req, res) {
    // Send JSON response with formatted books data
    res.send(JSON.stringify(books,null,4));
});

// Get the book list available in the shop using Axios to simulate API call
public_users.get('/', async function (req, res) {
    try {
        // Simulate an Axios request to a local route to fetch books data
        const response = await axios.get(booksApiUrl); // Axios makes a GET request to the mock API
        res.status(200).json(response.data); // Send the books data as a response
    } catch (error) {
        console.error("Error fetching books data:", error);
        res.status(500).json({ message: "Error fetching books data" }); // Handle Axios request errors
    }
});

// Get book details based on ISBN - SYNCHRONOUS
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Extract ISBN from URL parameter

    if (books[isbn]) {
        return res.status(200).json(books[isbn]); // Return book details
    } else {
        return res.status(404).json({ message: "Book not found" }); // If ISBN not found
    }
 });

 // Get book details based on ISBN using Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn; // Extract ISBN from URL parameter

    try {
        // Simulate an Axios request to fetch data for the specific ISBN
        const response = await axios.get(`${booksApiUrl}/${isbn}`);
        
        if (response.data) {
            return res.status(200).json(response.data); // Return book details
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book data" });
    }
});
  
// Get book details based on author - SYNCHRONOUS
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

// Get book details based on author using Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author; // Extract author from URL parameter
    let booksByAuthor = [];

    try {
        // Simulate an Axios request to fetch all books
        const response = await axios.get(booksApiUrl);
        booksByAuthor = response.data.filter(book => book.author.toLowerCase() === author.toLowerCase());

        if (booksByAuthor.length > 0) {
            return res.status(200).json(booksByAuthor); // Return books by author
        } else {
            return res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title - SYNCHRONOUS
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

// Get all books based on title using Axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title; // Extract title from URL parameter
    let booksByTitle = [];

    try {
        // Simulate an Axios request to fetch all books
        const response = await axios.get(booksApiUrl);
        booksByTitle = response.data.filter(book => book.title.toLowerCase() === title.toLowerCase());

        if (booksByTitle.length > 0) {
            return res.status(200).json(booksByTitle); // Return books by title
        } else {
            return res.status(404).json({ message: "No books found by this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
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
