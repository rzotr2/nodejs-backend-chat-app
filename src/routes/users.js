const express = require("express");
const User = require("../models/user.model");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send("Error fetching users: " + error.message);
    }
});

// Отримати користувача за id
router.get("/:id", (req, res) => {
    const id = req.params.id;
    res.send("User with id " + id);
});

module.exports = router;