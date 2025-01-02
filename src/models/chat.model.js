const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    messages: {

    }
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
