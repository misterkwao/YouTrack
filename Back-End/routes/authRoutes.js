const express = require('express');
const router = express.Router();
const { register,login,forgotPassword,resetPassword} = require('../controllers/usersAuthCtrl');

//router.post('/register', register)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword)

module.exports = router;