const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNo: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN", "ACCOUNTANT", "CASHIER", "MANAGER", "BACKOFFICE", "SALES", "OTHER"]
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
