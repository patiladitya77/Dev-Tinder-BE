const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const express = require("express");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {

        const user = req.user;
        // console.log(user);

        res.send(user);
    } catch (err) {
        res.send("ERROR: " + err.message);
    }
});

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
    try {
        // if (!validateEditProfileData(req)) {
        //     return res.status(401).send("cannot update");
        // }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.json({ message: `${loggedInUser.firstName}, your profile was updated succesfully`, data: loggedInUser });



    } catch (err) {
        res.send("ERROR: " + err.message);
    }
})

module.exports = profileRouter;