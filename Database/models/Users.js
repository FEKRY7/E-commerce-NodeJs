const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const FoxUserSchema = new mongoose.Schema({
    username: String,
    email: String,
    hash_password: String, // Changed 'password' to 'hash_password'
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    OTP: Number,
}, { timestamps: true });

FoxUserSchema.virtual('password')
    .set(function(password) {
        this.hash_password = bcrypt.hashSync(password, 2); // Used hashSync instead of hash
    });

FoxUserSchema.methods.authenticate = function(password) {
    return bcrypt.compareSync(password, this.hash_password);
};

const Users = mongoose.model('User', FoxUserSchema);

module.exports = Users;
