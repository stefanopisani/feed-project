const express = require('express');
const Like = require('../models/Like.model');
const {
  db
} = require('../models/Recipe.model');
const router = express.Router();
const Recipe = require('../models/Recipe.model');
const axios = require('axios');

/* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('index');
// });

router.get('/', async (req, res) => {
  let recipesFromDB = await Recipe.find(null, null, {
    sort: {
      createdAt: -1
    }
  }).populate('user').populate('like');

  res.render('index', {
    recipesFromDB,
    user: req.session.currentUser
  });
});

router.get('/random', async (req, res) => {
  let response = await axios.get(`https://api.spoonacular.com/recipes/random?apiKey=${process.env.API_KEY}`);
  res.render('random-recipe', { 
    randRecipe: response.data.recipes
  });
});


module.exports = router;