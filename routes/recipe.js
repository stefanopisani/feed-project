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
      recipe,
      user: req.session.currentUser
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
      ingredients,
      description,
      difficulty,
      time
    } = req.body;
    await Recipe.create({
      title,
      ingredients,
      description,
      difficulty,
      time,
      imageUrl: fileOnCloudinary,
      user
    });
    res.redirect('/');
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

//EDIT RECIPE

router.get('/edit-recipe/:recipeId', async (req, res) => {
  try {
    const currentUserId = req.session.currentUser._id;
    const user = await User.findById(currentUserId);
    res.render('recipe-details', {
      recipe,
      user
    });
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

// router.get('/edit-recipe/:recipeId', async (req, res) => {
//   const recipe = Recipe.findById(req.params.recipeId);
//   res.render('edit-recipe', {
//     recipe
//   });
// });
//HERE
router.get('/edit-recipe/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    res.render('edit-recipe', {
      recipe
    });
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

router.post('/edit-recipe/:recipeId', fileUpload.single('image'), async (req, res) => {
  try {
    const fileOnCloudinary = req.file.path; // file path (url) on cloudinary
    const recipeId = req.params.recipeId;
    const {
      title,
      description
    } = req.body;
    await Recipe.findByIdAndUpdate(recipeId, {
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

// DELETE RECIPE

router.post('/delete/:recipeId', async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.recipeId);
  res.redirect('/');
  //maybe we should soft delete??
});

router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const recipes = await Recipe.find({
      user: user
    });
    res.render('user-profile', {
      user,
      recipes
    });
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

// edit user profile routes 
router.get('/profile/edit/:userId', async (req, res) => {
  try {
    const currentUserId = req.session.currentUser._id;
    const user = await User.findById(req.params.userId);
    res.render('user-edit', {
      user,
      currentUserId
    });
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

router.post('/profile/edit/:userId', fileUpload.single('image'), async (req, res) => {
  try {

    const userId = req.params.userId;
    const username = req.body.username;
    const bio = req.body.bio;

    if (req.file) {
      await User.findByIdAndUpdate(userId, {
        username,
        bio,
        imageUrl: req.file.path
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        username,
        bio
      });
    }

    res.redirect(`/profile/${userId}`);

  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

// LIKING RECIPE 
router.post("/recipe/:recipeId/like", async (req, res) => {
  try {
    const {
      likes
    } = req.body;
    console.log(req.body);
    await Recipe.findByIdAndUpdate(req.params.recipeId, {
      $inc: {
        'likes': 1
      }
    });
    res.redirect('/');
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});


// --------------------

module.exports = router;