const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../user.model");

const loginService = async ({ email, password }) => {

    const user = await User.findOne({ email }).populate("flag");

    if (!user) {
        throw new Error("NOT_FOUND");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("INVALID_PASSWORD");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    return { token, user };
};

module.exports = { loginService };