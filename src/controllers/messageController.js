const { Message } = require('../models/message.model');

const getAllMessages = async () => {
    return await Message.find().then(messages => messages);
};

const sendMessage = async (message) => {
    const newMessage = await new Message(message);

    try {
        if (newMessage.author !== null) {
            newMessage.delivered = true;
            await newMessage.save();

            return newMessage;
        } else {
            throw new Error('path author is not set!!!');
        }
    } catch (err) {
        console.log("Error sending message: ", err.message);
        return newMessage;
    }
};

module.exports = {
    getAllMessages,
    sendMessage
};
