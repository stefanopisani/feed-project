const express = require('express');
const { db } = require('../models/Recipe.model');
const router = express.Router();
const Recipe = require('../models/Recipe.model');
const User = require('../models/User.model');

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


router.post("/:recipeId", async (req, res) => {
  try {
    const { likes } = req.body;
    console.log(req.body);
    await Recipe.findByIdAndUpdate(req.params.recipeId, {
      $inc : { 'likes': 1 }});
      res.redirect('/');
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});


module.exports = router;