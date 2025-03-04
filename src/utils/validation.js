const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name not valid");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");

    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }



};

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "age", "skills", "photoURL", "about"];

    const isUpdateAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

    return isUpdateAllowed;
}

module.exports = { validateSignUpData, validateEditProfileData };