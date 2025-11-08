const express = require("express");
const Chat = require("../models/chat");
const { userAuth } = require("../middlewares/auth");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetuserId", userAuth, async (req, res) => {
    try {
        const userId = req.user._id
        const { targetuserId } = req.params;
        let chat = await Chat.findOne({ participants: { $all: [userId, targetuserId] } }).populate("messages.senderId", "firstName lastName ");
        if (!chat) {
            chat = new Chat({ participants: [userId, targetuserId], messages: [] });
            await chat.save();
        }
        res.json(chat);

    } catch (error) {
        console.log(error)

    }
})

module.exports = chatRouter;