const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    isFilled: { type: Boolean, required: true, default: false },
    personalInfo: {
      gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
      dateOfBirth: String,
      nationality: { type: String, default: "INDIAN" },
      permanentAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: "India" },
      },
      correspondenceAddress: {
        sameAsPermanent: { type: Boolean, default: true },
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
      },
    },
    documents: {
      panNumber: {
        type: String,
        uppercase: true,
        match: [/^[A-Z]{5}[0-9]{4}[A-Z]$/, "PAN format is invalid"],
      },
      aadhaarNumber: {
        type: String,
        match: [/^\d{12}$/, "Aadhaar must be a 12-digit number"],
      },

      occupation: {
        type: String,
        enum: [
          "SALARIED",
          "SELF_EMPLOYED",
          "STUDENT",
          "BUSINESS",
          "HOUSEWIFE",
          "RETIRED",
          "OTHER",
        ],
      },
      monthlyIncome: {
        type: String,
        enum: [
          "BELOW_25000",
          "25000-50000",
          "50000-100000",
          "100000-200000",
          "ABOVE_200000",
        ],
      },
    },
    kycStatus: {
      personalInfo: {
        type: String,
        default: "ACTIVE",
        enum: ["ACTIVE", "DUE", "COMPLETE"],
      },
      documents: {
        type: String,
        default: "DUE",
        enum: ["ACTIVE", "DUE", "COMPLETE"],
      },
      overallStatus: {
        type: String,
        default: "PENDING",
        enum: ["PENDING", "PENDING_REVIEW", "REJECTED", "ON_HOLD", "APPROVED"], // if you added APPROVED
      },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      reviewedAt: Date,
      rejectionReason: String,
    },
  },
  { timestamps: true }
);
const UserDetails = mongoose.model("UserDetails", userDetailsSchema);
module.exports = UserDetails;
