const express = require("express");
const User = require("../models/user.model");
const {decodeToken, verifyToken} = require("../services/authService");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send("Error fetching users: " + error.message);
    }
});

router.get("/me",async (req, res) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        const decoded = decodeToken(token);
        verifyToken(token);

        const user = await User.findOne({email: decoded.email});

        res.status(200).json({user: user});
    } catch (err) {
        res.status(401).json({message: "User is not authorized"});
    }
});

module.exports = router;