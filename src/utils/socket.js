const {Server} = require("socket.io");

let io;

const socketConfig = {
    init: (server) => {
         io = new Server(server, {
            cors: {
                origin: "*", // URL вашого React-додатку
                methods: ["GET", "POST"], // Дозволені методи
            },
         });
         return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io is not initialized!');
        } else {
            return io;
        }
    }
}

module.exports = socketConfig;
