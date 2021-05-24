const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User.model')
// Add bcrypt to encrypt passwords
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10)
// Add passport
const passport = require('passport')

const ensureLogin = require('connect-ensure-login');

////////////SIGN UP//////////////////

router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) =>{
  const { username , password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log(`password hash ${hashedPassword}`)

  User.create({
    username : username,
    password : hashedPassword
  })
  .then(user => {
    console.log(`new user create`, user)
    res.redirect('/')
  })
  .catch(error => next(error));
})

////////////LOG IN//////////////////

router.get('/login', (req, res) => {
  res.render('auth/login')
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

/////////PRIVATE PAGE////////////////

router.get('/private-page', (req, res) => {
  if (!req.user) {
    res.redirect('/login'); // can't access the page, so go and log in
    return;
  }
 
  // ok, req.user is defined
  res.render('auth/private', { user: req.user });
});


//////////logout////////
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
