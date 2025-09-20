const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register
router.get('/register', authController.registerForm);
router.post('/register', authController.register);

// Login
router.get('/login', authController.loginForm);
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

// Forgot password
router.get('/forgot', authController.forgotForm);
router.post('/forgot', authController.forgotPassword);

// Reset password
router.get('/reset/:token', authController.resetForm);
router.post('/reset/:token', authController.resetPassword);

module.exports = router;