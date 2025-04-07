const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password, age, gender, about, photoURL } = req.body;

        //validaton of data
        validateSignUpData(req);

        //encryption of password
        const passwordHash = await bcrypt.hash(password, 10);

        //creating a new instance of user
        const user = new User({ firstName, lastName, emailId, password: passwordHash, age, gender, about, photoURL });
        const savedUser = await user.save();
        const token = await savedUser.getJWT();


        res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

        res.json({ message: "data added successfully", savedUser });
    } catch (err) {
        res.send("ERROR: " + err.message);
    }

});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            return res.status(401).send("invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            //create a token
            const token = await user.getJWT();

            //sending cookie back to user
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

            res.send(user);
        } else {
            return res.status(401).send("invalid credentials");;
        }


    } catch (err) {
        res.send("ERROR: " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("logout successfull");
})

module.exports = authRouter;