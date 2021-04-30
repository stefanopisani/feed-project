const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe.model');
const Favorite = require('../models/Favorite.model');
const fileUpload = require('../configs/cloudinary');
const User = require('../models/User.model');
const Like = require('../models/Like.model');
const {
  find
} = require('../models/Recipe.model');


//go to recipe details 

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
  res.render('add-recipe', {
    user: req.session.currentUser
  });
});


// ADD RECIPE
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
    const recipe = await Recipe.findById(req.params.recipeId);
    const currentUserId = req.session.currentUser._id;
    const user = await User.findById(currentUserId);
    console.log(recipe);
    res.render('edit-recipe', {
      recipe,
      user
    });
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

router.post('/edit-recipe/:recipeId', fileUpload.single('image'), async (req, res) => {
  try {

    // const fileOnCloudinary = req.file.path; // file path (url) on cloudinary
    const recipeId = req.params.recipeId;
    const {
      title,
      description
    } = req.body;

    if (req.file) {
      await Recipe.findByIdAndUpdate(recipeId, {
        title,
        description,
        imageUrl: req.file.path
      });
    } else {
      await Recipe.findByIdAndUpdate(recipeId, {
        title,
        description
      });
    }
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

// GO TO USER PROFILE
router.get('/profile/:userId', async (req, res) => {
  try {
    const userDetail = await User.findById(req.params.userId);
    const recipes = await Recipe.find({
      user: userDetail
    }, null, {
      sort: {
        createdAt: -1
      }
    })
    if (req.session.currentUser) {
      const currentUser = await User.findById(req.session.currentUser._id);
      const canEditProfile = currentUser._id == req.params.userId
      res.render('user-profile', {
        userDetail,
        recipes,
        user: currentUser,
        canEditProfile
      });
    } else {
      res.render('user-profile', {
        userDetail,
        recipes
      });
    }
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

// -- SEARCH FOR RECIPES ---

router.get('/search', async (req, res) => {
  try {
    const search = req.query.search;
    console.log('keyword', search);
    const results = await Recipe.find({
      title: {
        $regex: '.*' + search + '.*',
        $options: 'i'
      }
    }).populate('user');
    console.log('results', results);
    res.render('results', {
      results,
      user: req.session.currentUser
    });
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

// edit user profile routes 
router.get('/profile/edit/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render('user-edit', {
      user
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
    const user = await User.findById(req.session.currentUser._id);
    const recipe = await Recipe.findById(req.params.recipeId);

    const existingLike = await Like.findOne({
      user: user,
      recipe: recipe
    });

    if (!existingLike) {
      const like = await Like.create({
        user,
        recipe
      });
      await Recipe.findByIdAndUpdate(recipe._id, {
        $push: {
          like: like
        }
      })
    } else {
      //Delete like
    }

    res.redirect('/');
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});


// --------------------

// SAVE AS FAVORITE

router.post('/favorites/:recipeId', async (req, res) => {
  try {
    Favorite.create({
      user: req.session.currentUser._id,
      recipe: req.params.recipeId
    });
    res.redirect('/favorites');
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});
router.get('/favorites', async (req, res) => {
  try {
    let favorites = await Favorite.find({
      user: req.session.currentUser._id
    }, null, {
      sort: {
        createdAt: -1
      }
    }).populate('recipe');
    console.log(favorites);
    res.render('favorites', {
      favorites,
      user: req.session.currentUser
    });
  } catch (e) {
    res.render('error');
    console.log(`An error occurred ${e}`);
  }
});

// Delete from favorites

router.post('/delete-favorite/:recipeId', async (req, res) => {
  const toDel = await Favorite.findByIdAndRemove(req.params.recipeId);
  res.redirect('/favorites');
});

// --------

module.exports = router;