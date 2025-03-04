const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");


const app = express();  //creating instance of express js application
app.use(express.json());
app.use(cookieparser());

app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;

        //validaton of data
        validateSignUpData(req);

        //encryption of password
        const passwordHash = await bcrypt.hash(password, 10);

        //creating a new instance of user
        const user = new User({ firstName, lastName, emailId, password: passwordHash });

        await user.save();
        res.send("data added successfully");
    } catch (err) {
        res.send("ERROR: " + err.message);
    }

});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            //create a token
            const token = await user.getJWT();

            //sending cookie back to user
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });

            res.send("Login successfull");
        } else {
            throw new Error("Invalid credentials");
        }


    } catch (err) {
        res.send("ERROR: " + err.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {

        const user = req.user;
        // console.log(user);

        res.send(user);
    } catch (err) {
        res.send("ERROR: " + err.message);
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;

    res.send(user.firstName + " sent a connection request");
})



connectDB().then(() => {
    console.log("connection successfully established");

    app.listen(7777, () => {
        console.log("server is successfully listening on port 7777");
    })

}).catch((err) => {
    console.log("cannot establish connection to databse");
});
