const express = require("express");
const router = express.Router();

// Отримати всі повідомлення
router.get("/messages", (req, res) => {
    res.send("messages");
});

// Отримати повідомлення за id
router.get("/messages/:id", (req, res) => {
    const id = req.params.id;
    res.send("Message with id " + id);
});

module.exports = router;