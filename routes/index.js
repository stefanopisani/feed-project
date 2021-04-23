const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe.model');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;