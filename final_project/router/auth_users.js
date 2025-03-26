const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const secretKey = "your_jwt_secret"; // Secret key for JWT signing

const isValid = (username)=>{ //returns boolean
    // Check if the username exists in the users array
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Check if the provided username and password match any user in the users array
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the user exists and password is correct
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful", token });
});


// Add or modify a book review
regd_users.put("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from URL
    const { username, review } = req.body; // Get username & review from request body

    if (!username || !review) {
        return res.status(400).json({ message: "Username and review are required" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews if not present
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
