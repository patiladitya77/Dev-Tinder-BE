const { userAuth } = require("../middlewares/auth");
const express = require("express");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {

        const user = req.user;
        // console.log(user);

        res.send(user);
    } catch (err) {
        res.send("ERROR: " + err.message);
    }
});

module.exports = profileRouter;