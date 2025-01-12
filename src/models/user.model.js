const mongoose = require('mongoose');
const { messageSchema } = require("../models/message.model");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    country: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
    },
    gender: {
        type: String,
        required: true,
    },
    status: {
        type: String,
    },
    messages: {
        type: [messageSchema],
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
