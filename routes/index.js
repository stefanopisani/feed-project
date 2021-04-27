const express = require('express');
const { db } = require('../models/Recipe.model');
const router = express.Router();
const Recipe = require('../models/Recipe.model');
const axios = require('axios');

/* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('index');
// });

router.get('/', async (req, res) => {
  let response = await axios.get(`https://api.spoonacular.com/food/trivia/random?apiKey=${process.env.API_KEY}`);
  let recipesFromDB = await Recipe.find().populate('user');
  res.render('index', {
    recipesFromDB,
    user: req.session.currentUser,
    fact: response.data.text
  });
});


module.exports = router;