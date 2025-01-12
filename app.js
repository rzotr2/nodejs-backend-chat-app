require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const { registerUser, loginUser, findUser } = require("./src/controllers/userController");

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(bodyParser.json());
app.use(cors());


const mongoDB = process.env.DB_URL;

const PORT = process.env.PORT || 8080;

const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users");
const messageRoutes = require("./src/routes/messages");
const { getAllMessages, sendMessage } = require("./src/controllers/messageController");
const { decodeToken, verifyToken } = require("./src/services/authService");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

app.use(express.json());


(async () => {
    try {
        await mongoose.connect(mongoDB).then(() => console.log('MongoDB Connected'));

        server.listen(PORT, '192.168.2.123');
    } catch (e) {
        console.error(e);
    }
})();

io.on('connection', (socket) => {
    // Middleware
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("No token provided"));
        }

        try {
            const decoded = decodeToken(token);
            const currentUser = decoded;
            verifyToken(token);

            const user = await findUser(currentUser.email);
            console.log(`User ${user.username} connected`);

            next();
        } catch (err) {
            console.log(err)
            console.log(new Error('Authentication error - Invalid token'));

            next(new Error('Authentication error - Invalid token'));
        }
    });

    socket.on('register', async (data) => {
        console.log('Attempt to register')
        await registerUser(data).then((result) => {
            socket.emit('userRegistered', result)
        });
    });

    socket.on('login', async (userData) => {
        console.log('attempt login')
        const user = await findUser(userData.username);
        await loginUser(userData).then((result) => {
            socket.emit('userLoginResult', {result, user});
        });
    });

    socket.on('getAllMessages', async () => {
        await getAllMessages().then((result) => {
            socket.emit('allMessagesSent', result);
        });
    });

    socket.on('sendMessage', async (message) => {
        console.log(message);
        await sendMessage(message).then((result) => {
            socket.emit('messageSent', result);
            socket.broadcast.emit('messageSent', result);
        });
    });
});
