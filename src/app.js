const express = require("express");
const connectDB = require("./config/database")

const app = express();  //creating instance of express js application


connectDB().then(() => {
    console.log("connection successfully established");

    app.listen(7777, () => {
        console.log("server is successfully listening on port 7777");
    })

}).catch((err) => {
    console.log("cannot establish connection to databse");
});
