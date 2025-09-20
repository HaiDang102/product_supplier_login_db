const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// =====================
// REGISTER
// =====================
router.get('/register', authController.registerForm); // Hiển thị form đăng ký
router.post('/register', authController.register); // Xử lý đăng ký

// =====================
// LOGIN
// =====================
router.get('/login', authController.loginForm); // Hiển thị form login
router.post('/login', authController.login); // Xử lý login

// =====================
// LOGOUT
// =====================
router.get('/logout', authController.logout); // Xử lý logout

// =====================
// FORGOT PASSWORD
// =====================
router.get('/forgot', authController.forgotForm); // Hiển thị form quên mật khẩu
router.post('/forgot', authController.forgotPassword); // Gửi mail reset password

// =====================
// RESET PASSWORD
// =====================
router.get('/reset/:token', authController.resetForm); // Hiển thị form reset password
router.post('/reset/:token', authController.resetPassword); // Xử lý reset password

module.exports = router;