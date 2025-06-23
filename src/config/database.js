const mongoose = require("mongoose");

require("dotenv").config();
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://adpatil587:adityaPATIL@cluster0.7encg.mongodb.net/DevTinder");
};

module.exports = connectDB;

