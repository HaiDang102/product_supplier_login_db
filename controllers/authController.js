// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

module.exports = {
    // =====================
    // REGISTER
    // =====================
    registerForm: (req, res) => {
        res.render('auth/register');
    },

    register: async(req, res) => {
        try {
            const { username, email, phone, password } = req.body;
            const user = new User({ username, email, phone, password });
            await user.save();
            req.session.user = { id: user._id, username: user.username };
            res.redirect('/');
        } catch (err) {
            res.status(400).send(err.message);
        }
    },

    // =====================
    // LOGIN
    // =====================
    loginForm: (req, res) => {
        res.render('auth/login');
    },

    login: async(req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) return res.status(400).send('User not found');
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).send('Wrong password');
            req.session.user = { id: user._id, username: user.username };
            res.redirect('/');
        } catch (err) {
            res.status(400).send(err.message);
        }
    },

    // =====================
    // LOGOUT
    // =====================
    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) return res.status(500).send(err.message);
            res.clearCookie('connect.sid');
            res.redirect('/auth/login');
        });
    },

    // =====================
    // FORGOT PASSWORD
    // =====================
    forgotForm: (req, res) => {
        res.render('auth/forgot');
    },

    forgotPassword: async(req, res) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.send('Email không tồn tại');

        const token = user.createResetToken();
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        const resetLink = `http://${req.headers.host}/auth/reset/${token}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `Nhấn vào link để reset password (1 giờ): ${resetLink}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.error(err);
            res.send('Email reset đã được gửi!');
        });
    },

    // =====================
    // RESET PASSWORD
    // =====================
    resetForm: async(req, res) => {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) return res.send('Token không hợp lệ hoặc đã hết hạn');
        res.render('auth/reset', { token: req.params.token });
    },

    // RESET PASSWORD
    resetPassword: async(req, res) => {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) return res.render('auth/reset', { error: 'Token không hợp lệ hoặc đã hết hạn' });

        user.password = req.body.password; // pre-save hook sẽ hash
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.render('auth/login', { success: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập lại.' });
    }
};