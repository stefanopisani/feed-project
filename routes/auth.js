const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const fileUpload = require('../configs/cloudinary');


// LOGIN
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  const {
    username,
    password
  } = req.body;
  console.log(req.body);
  //check if empty
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Indicate username and password'
    })
    return;
  }

  //check if user exists
  const currentUser = await User.findOne({
    username: username
  })
  if (currentUser === null) {
    res.render('auth/login', {
      errorMessage: 'Invalid login'
    });
    return;
  }
  //user and pass match
  if (bcrypt.compareSync(password, currentUser.password)) {
    req.session.currentUser = currentUser;
    res.redirect('/');

  } else {
    //pass doesnt match
    res.render('auth/login', {
      errorMessage: 'Invalid Login'
    });
    return;
  }
});


// SIGNUP
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', fileUpload.single('image'), async (req, res) => {
  const fileOnCloudinary = req.file.path;
  const {
    username,
    bio,
    email,
    password
  } = req.body;
  if (username === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'indicate username and password'
    })
    return;
  }
  // check pass strength - regular expression (can check strength of pass
  //or if email is correct, etc. )
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
  if (passwordRegex.test(password) === false) {
    res.render('auth/signup', {
      errorMessage: 'Password is too weak'
    });
    return;
  }
  //check if user already exists
  let user = await User.findOne({
    username: username
  });
  if (user !== null) {
    res.render('auth/signup', {
      errorMessage: 'user already exists'
    });
    return;
  }
  user = await User.findOne({
    email: email
  });
  if (user !== null) {
    res.render('auth/signup', {
      errorMessage: 'Email already exists'
    })
    return;
  }

  //create the user in the database
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    await User.create({
      username,
      bio,
      password: hashedPassword,
      email,
      imageUrl: fileOnCloudinary
    });
    res.redirect('/');
  } catch (e) {
    res.render('auth/signup', {
      errorMessage: 'error occured, the image cannnot be added'
    });
    return;
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;