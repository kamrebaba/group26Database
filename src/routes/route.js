const express = require('express');
const router = express.Router();
const UserController=require('../Controllers/UserController.js')

router.get('/test-me', function (req, res) {
    console.log('My batch is', req.name)
    res.send('My second ever api!')
});


router.post('/register',UserController.CreateUser)













module.exports = router