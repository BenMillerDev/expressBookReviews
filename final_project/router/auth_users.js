const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return false;
      } else {
        return true;
      }
}

const authenticatedUser = (username,password)=>{
    
    let validusers = users.filter((user)=>{
      console.log("stored username: " + user.username);
      console.log("stored password: " + user.password);
      return (user.username === username && user.password === password)
    });

    return validusers.length > 0;
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    console.log("users list before calling authenticatedUser: " + users);
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 }); //  1 hour
       
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");

    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.body.username;
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {

    if (book["reviews"]) {
        book["reviews"][username] = req.body.review;
    } else {
      book["reviews"] = {};
      book["reviews"][username] = req.body.review;
    }
     return res.status(200).send("Review added successfully");
  } else {
    return res.status(404).json({ message: "Book not found" });
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.body.username;
    const isbn = req.params.isbn;
    let book = books[isbn];
    console.log("delete book reviews:" + JSON.stringify({book},null,2));
    if (book) {
      if (book["reviews"][username]) {
          delete book["reviews"][username];
          return res.status(200).send("Review deleted successfully");
      } else {
        return res.status(404).json({ message: "User has no reviews for this book" });
      }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
