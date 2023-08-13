const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      if (isValid(username)) {
          users.push({"username": username, "password": password})
          return res.status(200).json({message: "Registered successfully"});
      } else {
        return res.status(404).json({message: "User already exists!"}); 
      }
  } else {
    return res.status(404).json({message: "Username or Password was not provided."}); 
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    var booklist = JSON.stringify({books},null,2)
    res.send(booklist);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    res.send(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let booksByAuthor = [];

  for (let key in books) {
     if (books.hasOwnProperty(key)) {
         let bookDetails = books[key];

         if (bookDetails.author === author) {
           booksByAuthor.push(bookDetails)
         }
     }
  }
  if (booksByAuthor.length > 0) {
    res.send(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found" });
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let bookWithTitle = [];
  
    for (let key in books) {
       if (books.hasOwnProperty(key)) {
           let bookDetails = books[key];
  
           if (bookDetails.title === title) {
             bookWithTitle.push(bookDetails)
           }
       }
    }
    if (bookWithTitle.length > 0) {
      res.send(bookWithTitle);
    } else {
      return res.status(404).json({ message: "No books found" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
  
    if (book) {
      res.send(book.reviews);
    } else {
      return res.status(404).json({ message: "Book review not found" });
    }
});

// Get the book list available in the shop asynchronously
public_users.get('/async-get-books',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        var booklist = JSON.stringify({books},null,2)
        resolve(res.send(booklist));
      });

      get_books.then(() => console.log("Promise for Task 10"));

});

// Get book details based on ISBN asynchronously
public_users.get('/async-get-isbn/:isbn',function (req, res) {
    
    const get_isbn = new Promise((resolve, reject) => {
        let isbn = req.params.isbn;
        let book = books[isbn];
  
        if (book) {
          res.send(book);
        } else {
          return res.status(404).json({ message: "Book not found" });
        }
      });
    get_isbn.then(() => console.log("Promise for Task 11"));
});

// Get book details based on author asynchronously
public_users.get('/async-get-author/:author',function (req, res) {
    
    const get_author = new Promise((resolve, reject) => {
        let author = req.params.author;
        let booksByAuthor = [];
  
        for (let key in books) {
           if (books.hasOwnProperty(key)) {
               let bookDetails = books[key];
  
               if (bookDetails.author === author) {
                 booksByAuthor.push(bookDetails)
               }
            }
        }

        if (booksByAuthor.length > 0) {
          res.send(booksByAuthor);
        } else {
          return res.status(404).json({ message: "No books found" });
        }
      });

      get_author.then(() => console.log("Promise for Task 12"));

  });

  // Get book details based on title asynchronously
public_users.get('/async-get-title/:title',function (req, res) {
    
    const get_author = new Promise((resolve, reject) => {
        let title = req.params.title;
        let bookWithTitle = [];
  
        for (let key in books) {
           if (books.hasOwnProperty(key)) {
               let bookDetails = books[key];
  
               if (bookDetails.title === title) {
                bookWithTitle.push(bookDetails)
               }
            }
        }

        if (bookWithTitle.length > 0) {
          res.send(bookWithTitle);
        } else {
          return res.status(404).json({ message: "No books found" });
        }
      });

      get_author.then(() => console.log("Promise for Task 13"));

  });

module.exports.general = public_users;
