const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");


const app = express();  //creating instance of express js application
app.use(express.json());

app.post("/signup", async (req, res) => {

    const user = new User(req.body);

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
