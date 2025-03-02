const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcyprt = require("bcrypt");


const app = express();  //creating instance of express js application
app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;

        //validaton of data
        validateSignUpData(req);

        //encryption of password
        const passwordHash = await bcyprt.hash(password, 10);

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
        const isPasswordValid = await bcyprt.compare(password, user.password);
        if (isPasswordValid) {
            res.send("Login successfull");
        } else {
            throw new Error("Invalid credentials");
        }


    } catch (err) {
        res.send("ERROR: " + err.message);
    }
})

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const user = await User.findOne({ emailId: userEmail });
        res.send(user);
    } catch (err) {
        res.status(404).send("something went wrong")
    }
});
app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(404).send("something went wrong")
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {

        await User.findByIdAndDelete(userId);
        res.send("user deleted");
    } catch (err) {
        res.send(err.message);
    }


});

app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {

        const ALLOWED_UPDATES = ["userId", "age", "gender", "password", "skills", "about"];
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("update not allowed");
        }
        await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after", runValidators: true });
        res.send("user updated successfully");

    } catch (err) {
        res.send(err.message);
    }
})








connectDB().then(() => {
    console.log("connection successfully established");

    app.listen(7777, () => {
        console.log("server is successfully listening on port 7777");
    })

}).catch((err) => {
    console.log("cannot establish connection to databse");
});
