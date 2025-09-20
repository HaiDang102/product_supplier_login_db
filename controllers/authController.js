const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

module.exports = {
    // =====================
    // REGISTER
    // =====================
    registerForm: (req, res) => {
        res.render('auth/register', {
            error: null,
            username: '',
            email: '',
            phone: ''
        });
    },

    register: async(req, res) => {
        try {
            const { username, email, phone, password } = req.body;

            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.render('auth/register', {
                    error: 'Username hoặc email đã tồn tại',
                    username,
                    email,
                    phone
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = new User({ username, email, phone, password: hashedPassword });
            await user.save();

            req.session.user = { id: user._id, username: user.username };
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.render('auth/register', {
                error: 'Đã xảy ra lỗi server.',
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone
            });
        }
    },

    // =====================
    // LOGIN
    // =====================
    loginForm: (req, res) => {
        res.render('auth/login', {
            error: null,
            success: null,
            username: ''
        });
    },

    login: async(req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });

            if (!user) {
                return res.render('auth/login', {
                    error: 'User không tồn tại',
                    success: null,
                    username
                });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.render('auth/login', {
                    error: 'Sai mật khẩu',
                    success: null,
                    username
                });
            }

            req.session.user = { id: user._id, username: user.username };
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.render('auth/login', {
                error: 'Đã xảy ra lỗi server.',
                success: null,
                username: req.body.username
            });
        }
    },

    // =====================
    // LOGOUT
    // =====================
    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }
            res.clearCookie('connect.sid');
            res.redirect('/auth/login');
        });
    },

    // =====================
    // FORGOT PASSWORD
    // =====================
    forgotForm: (req, res) => {
        res.render('auth/forgot', {
            error: null,
            success: null,
            email: ''
        });
    },

    forgotPassword: async(req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.render('auth/forgot', {
                    error: 'Email không tồn tại',
                    success: null,
                    email
                });
            }

            // Tạo token reset
            const token = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ
            await user.save();

            // Nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const resetLink = `http://${req.headers.host}/auth/reset/${token}`;
            const mailOptions = {
                from: `"Product App" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'Reset Password',
                text: `Bạn nhận được email này vì bạn (hoặc ai đó) yêu cầu reset password.\n\n` +
                    `Nhấn vào link sau để reset password (1 giờ): ${resetLink}\n\n` +
                    `Nếu bạn không yêu cầu, hãy bỏ qua email này.`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Lỗi gửi mail:', err);
                    return res.render('auth/forgot', {
                        error: '❌ Không gửi được mail. Xem console để biết lỗi.',
                        success: null,
                        email
                    });
                }

                console.log('Mail đã gửi:', info.response);
                console.log('Link reset password:', resetLink);

                res.render('auth/forgot', {
                    error: null,
                    success: `✅ Email reset đã được gửi đến ${user.email}. Kiểm tra hộp thư!`,
                    email: ''
                });
            });

        } catch (err) {
            console.error(err);
            res.render('auth/forgot', {
                error: 'Đã xảy ra lỗi server.',
                success: null,
                email: req.body.email
            });
        }
    },

    // =====================
    // RESET PASSWORD
    // =====================
    resetForm: async(req, res) => {
        try {
            const user = await User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.render('auth/reset', {
                    error: 'Token không hợp lệ hoặc đã hết hạn',
                    success: null,
                    token: null
                });
            }

            res.render('auth/reset', {
                error: null,
                success: null,
                token: req.params.token
            });
        } catch (err) {
            console.error(err);
            res.render('auth/reset', {
                error: 'Đã xảy ra lỗi server.',
                success: null,
                token: null
            });
        }
    },

    resetPassword: async(req, res) => {
        try {
            const user = await User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.render('auth/reset', {
                    error: 'Token không hợp lệ hoặc đã hết hạn',
                    success: null,
                    token: req.params.token
                });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.render('auth/login', {
                success: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập lại.',
                error: null,
                username: user.username
            });

        } catch (err) {
            console.error(err);
            res.render('auth/reset', {
                error: 'Đã xảy ra lỗi server.',
                success: null,
                token: req.params.token
            });
        }
    }
};