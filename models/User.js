const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

// Hash password trước khi save
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Tạo token reset password
userSchema.methods.createResetToken = function() {
    const token = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = token;
    this.resetPasswordExpires = Date.now() + 3600000; // 1 giờ
    return token;
};

module.exports = mongoose.model('User', userSchema);