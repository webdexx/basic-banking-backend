const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ifsc: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Balance cannot be negative"],
    },
    blockedAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Blocked amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED", "CLOSED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;