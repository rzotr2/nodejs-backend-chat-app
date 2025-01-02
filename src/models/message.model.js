const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
    },
    delivered: {
        type: Boolean,
    },
    received: {
        type: Boolean,
    }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = {
    Message,
    messageSchema
}