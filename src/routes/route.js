const express = require('express');
const router = express.Router();
const UserController=require('../Controllers/UserController.js')
const BookController=require('../Controllers/BookController.js')
const Auth=require('../middleware/auth.js')
const ReviewController=require('../Controllers/ReviewController.js')

router.get('/test-me', function (req, res) {
    console.log('My batch is', req.name)
    res.send('My second ever api!')
});


router.post('/register',UserController.CreateUser)
router.post('/login',UserController.LoginUser)
router.post('/books',Auth.authentication,Auth.authorisation,BookController.createBook)
router.get('/books/:bookId',Auth.authentication,BookController.getBookById)
router.get('/books',Auth.authentication,BookController.getBooks)
router.delete('/books/:bookId',Auth.authentication,Auth.authorisation,BookController.deleteBooks)
router.put('/books/:bookId',BookController.UpdateBooks)
router.post('/books/:bookId/review',ReviewController.Postreviews)










module.exports = router