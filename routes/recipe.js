const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe.model');

//go to user profile 

router.get('/recipe-details/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.userId);
    res.render('recipe-details', {
      recipe
    });
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});


module.exports = router;