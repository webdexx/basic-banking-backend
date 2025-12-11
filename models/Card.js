const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    securityCode: {
      type: Number,
      required: true,
      default: 111,
      max: 999,
    },
    limit: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Limit cannot be negative"],
    },
    cardType: {
      type: String,
      required: true,
      default: "Prepaid",
      enum: ["Prepaid", "Postpaid"],
    },
    expiryMonth: {
      type: Number,
      min: 1,
      max: 12,
      required: true,
    },
    expiryYear: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "ACTIVE",
      enum: ["ACTIVE", "SUSPENDED", "BLOCKED"],
    },
    dependency: {
      type: String,
      required: true,
      default: "RUPAY",
      enum: ["RUPAY", "VISA", "MASTERCARD"],
    },
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
