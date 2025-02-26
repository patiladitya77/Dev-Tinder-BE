const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user")

const app = express();  //creating instance of express js application

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Aditya",
        lastName: "Patil",
        emailId: "aditya@gmail.com",
        password: "aditya@2005",
    });

    await user.save();
    res.send("data added successfully");
})








connectDB().then(() => {
    console.log("connection successfully established");

    app.listen(7777, () => {
        console.log("server is successfully listening on port 7777");
    })

}).catch((err) => {
    console.log("cannot establish connection to databse");
});
