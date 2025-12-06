const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                message: "Invlid Password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
       });
    } catch(error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

module.exports = { login };