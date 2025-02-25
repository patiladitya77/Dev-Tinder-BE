const express = require("express");

const app = express();  //creating instance of express js application

app.use("/hello", (req, res) => {
    res.send("hello from server");

});

app.use("/dashboard", (req, res) => {
    res.send("hello from dashboard!!!!");
});

app.listen(7777, () => {
    console.log("server is successfully listening on port 7777");
})