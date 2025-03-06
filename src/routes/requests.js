const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(status)) {
            throw new Error("incorrect status type");
        }


        const toUser = await User.findById(toUserId);
        if (!toUser) {
            throw new Error("User does not exists");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) {
            throw new Error("Request already exists");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });


        const data = await connectionRequest.save();
        res.json({ message: status, data });
    } catch (err) {
        res.send("ERROR: " + err.message);
    }

});

module.exports = requestRouter;