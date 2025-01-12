const express = require("express");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const {generateToken} = require("../services/authService");
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const newUser = new User(req.body);

        newUser.password = await bcrypt.hash(newUser.password, 12);

        await newUser.save();
        console.log('User successfully registered');

        return res.status(201).json({message: "User registered successfully"});
    } catch(err) {
        console.log(err)
        res.status(400).json({message: "Registration is failed"});
    }
});

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });

        let passwordMatch;

        if (user) {
            passwordMatch = await bcrypt.compare(password, user.password);
        }

        if (passwordMatch) {
            res.status(200).json({token: generateToken({email, password})});
        } else {
            res.status(401).json({ error: 'Error in user login' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Error in user login' });
    }
});

module.exports = router;
