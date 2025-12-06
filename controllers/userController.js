const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
      const { firstName, lastName, email, password, isActive, flag } = req.body;

      const existingUser = await User.findOne({ email });

      if(existingUser) {
        return res.status(400).json({
            message: "User Already registered"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isActive,
            flag
        });

        return res.status(201).json({
            message: "User Created Successfully",
            newUser
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
};

module.exports = { registerUser };