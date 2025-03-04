const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) {
            throw new Error("Token not valid");
        }

        const decodedMessage = await jwt.verify(token, "jaggery");

        const { _id } = decodedMessage;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("usr not found");

        }

        req.user = user;    //attaching user to req object. when control will go to req habdler,in that req  user will be already present
        next();
    } catch (err) {
        res.send("ERROR: " + err.message);
    }

};
module.exports = {
    userAuth
}