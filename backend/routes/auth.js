const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
// SignUp
router.post('/signup', authController.postSignUp)


// Login
router.post('/login',authController.postLogin);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);
router.get('/:userId', authController.getUser);
router.post('/update',checkAuth, authController.updateUser)
router.post('/update/email',checkAuth, authController.updateEmail)
router.post('/update/shipping-details',checkAuth, authController.updateShipping)
module.exports = router;