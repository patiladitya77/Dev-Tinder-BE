const express = require("express");
const connectDB = require("./config/database");

const cookieparser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("dotenv").config();

const app = express();  //creating instance of express js application
app.use(cors({
    origin: process.env.ORIGIN_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(cookieparser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter)


const initializeSocket = require("./utils/socket");

const server = http.createServer(app);
initializeSocket(server);


connectDB().then(() => {
    console.log("connection successfully established");

    server.listen(7777, () => {
        console.log("server is successfully listening on port 7777");
    })

}).catch((err) => {
    console.log("cannot establish connection to databse");
});
