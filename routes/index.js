const express = require('express');
const { db } = require('../models/Recipe.model');
const router = express.Router();
const Recipe = require('../models/Recipe.model');

/* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('index');
// });

router.get('/', async (req, res) => {
  let recipesFromDB = await Recipe.find().populate('user');
  res.render('index', {
    recipesFromDB,
    user: req.session.currentUser
  });
});


module.exports = router;