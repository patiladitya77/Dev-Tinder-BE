const express = require("express");
const connectDB = require("./config/database");

const cookieparser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();  //creating instance of express js application
app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(cookieparser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


connectDB().then(() => {
    console.log("connection successfully established");

    app.listen(7777, () => {
        console.log("server is successfully listening on port 7777");
    })

}).catch((err) => {
    console.log("cannot establish connection to databse");
});
