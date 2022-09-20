const express = require('express');
const router = express.Router();

router.get('/test-me', function (req, res) {
    console.log('My batch is', abc.name)
   

    res.send('My second ever api!')
});
















module.exports = router