require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');
const app = express();
const { Server } = require("socket.io");
const User = require("./src/models/user.model");
const http = require("http");
const { registerUser, loginUser, findUser } = require("./src/controllers/userController");

const PUBLIC_EVENTS = ["login", "register"];

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // URL вашого React-додатку
        methods: ["GET", "POST"], // Дозволені методи
    },
});

app.use(cors());

const mongoDB = process.env.DB_URL;

const PORT = process.env.PORT || 8080;

const userRoutes = require("./src/routes/users");
const messageRoutes = require("./src/routes/messages");
const { getAllMessages, sendMessage } = require("./src/controllers/messageController");
const { decodeToken, verifyToken } = require("./src/services/authService");

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

app.use(express.json());

(async () => {
    try {
        await mongoose.connect(mongoDB).then(() => console.log('MongoDB Connected'));

        server.listen(PORT, () => {
            console.log(`[server] Server started on PORT ${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
})();

io.on('connection', (socket) => {
    console.log('Socket.io connection established');

    // Middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        socket.onAny((eventName) => {
            if (PUBLIC_EVENTS.includes(eventName)) {
                console.log(eventName);
                return next();
            }
        })

        if (!token) {
            return next(new Error("No token provided"));
        }

        try {
            const decoded = decodeToken(token);
            socket.currentUser = decoded;
            verifyToken(token);

            (async () => {
                const user = await findUser(socket.currentUser.username);
                console.log(user);
            })();


            next();

        } catch (err) {
            console.log(new Error('Authentication error - Invalid token'));
        }
    });

    // Sockets for users
    socket.on('register', async (data) => {
        await registerUser(data).then((result) => {
            socket.emit('userRegistered', result)
        });
    });

    socket.on('login', async (userData) => {
        console.log()
        await loginUser(userData).then((result) => {
            console.log('login result')
            socket.emit('userLoginResult', result); // Result вже передає результат логіну, чи збігається пароль, а також токен.
        });
    });

    // Sockets for messages
    socket.on('getAllMessages', async () => {
        console.log(`User ${socket.currentUser?.username} connected`);
        await getAllMessages().then((result) => {
            socket.emit('allMessagesSent', result);
        });
    });

    socket.on('sendMessage', async (message) => {
        await sendMessage(message, socket).then((result) => {
            socket.emit('allMessagesSent', result);
        });
    });
});
