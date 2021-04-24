const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe.model');
const fileUpload = require('../configs/cloudinary');
const User = require('../models/User.model');

//go to user profile 

router.get('/recipe-details/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    res.render('recipe-details', {
      recipe
    });
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

router.get('/add-recipe', async (req, res) => {
  res.render('add-recipe')
});

router.post('/add-recipe', fileUpload.single('image'), async (req, res) => {
  try {
    const currentUserId = req.session.currentUser._id;
    const fileOnCloudinary = req.file.path; // file path (url) on cloudinary
    const user = await User.findById(currentUserId);
    const {
      title,
      description
    } = req.body;
    await Recipe.create({
      title,
      description,
      imageUrl: fileOnCloudinary,
      user
    });
    res.redirect('/');
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

//edit recipe

router.get('/recipe-details/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    res.render('recipe-details', {
      recipe
    });
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

router.get('/edit-recipe', async (req, res) => {
  res.render('edit-recipe');
});

router.post('/edit-recipe', fileUpload.single('image'), async (req, res) => {
  try {
    const fileOnCloudinary = req.file.path; // file path (url) on cloudinary

    const {
      title,
      description
    } = req.body;
    await Recipe.findByIdAndUpdate({
      title,
      description,
      imageUrl: fileOnCloudinary
    });
    res.redirect('/');
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('recipe');
    res.render('user-profile', {
      user
    });
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});


module.exports = router;