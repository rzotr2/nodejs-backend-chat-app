const { Message } = require('../models/message.model');

const getAllMessages = async () => {
    return Message.find();
};

const sendMessage = async (message, socket) => {
    try {
        const newMessage = new Message(message);
        // newMessage.author = socket.currentUser?.username;

        await newMessage.save();
    } catch (err) {
        console.log("Error sending message", err.message);
    }
};

module.exports = {
    getAllMessages,
    sendMessage
};
