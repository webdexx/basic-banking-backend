const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id;

    const existingUser = await User.findOne({ _id: userId });

    const oldPassword = existingUser.password;

    const validateNewPassword = () => {
      if (newPassword.length < 6) {
        
          const errMsg = "New Password should be more than 6 characters";
      }
    };

    if(!validateNewPassword) {
        res.status(400).json({
            message: errMsg,
        })
    }

    const comparePassword = await bcrypt.compare(newPassword, oldPassword);

    if (!comparePassword) {
      res.status(400).json({
        message: "Old Password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const passwordUpdate = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    return res.status(201).json({
      message: "Password Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { registerUser };
