const express = require("express");

const app = express();  //creating instance of express js application

app.get("/user/:userid/:status", (req, res) => {
    console.log(req.params);
    res.send({ fname: "aditya", age: 20 });
});

app.post("/user", (req, res) => {
    res.send("new user created");
});


app.listen(7777, () => {
    console.log("server is successfully listening on port 7777");
})