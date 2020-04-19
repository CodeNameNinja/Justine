const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// SignUp
router.post('/signup', authController.postSignUp)

// Login
router.post('/login',authController.postLogin);

module.exports = router;