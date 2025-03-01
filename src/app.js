const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");


const app = express();  //creating instance of express js application
app.use(express.json());

app.post("/signup", async (req, res) => {

    const user = new User(req.body);

    await user.save();
    res.send("data added successfully");
});

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








connectDB().then(() => {
    console.log("connection successfully established");

    app.listen(7777, () => {
        console.log("server is successfully listening on port 7777");
    })

}).catch((err) => {
    console.log("cannot establish connection to databse");
});
