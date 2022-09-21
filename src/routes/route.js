const express = require('express');
const router = express.Router();
const UserController=require('../Controllers/UserController.js')
const BookController=require('../Controllers/BookController.js')
router.get('/test-me', function (req, res) {
    console.log('My batch is', req.name)
    res.send('My second ever api!')
});


router.post('/register',UserController.CreateUser)
router.post('/login',UserController.LoginUser)
router.post('/books',BookController.createBook)
router.get('/books/:bookId',BookController.getBookById)
router.get('/books',BookController.getBooks)











module.exports = router