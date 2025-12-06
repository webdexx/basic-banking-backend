const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    mobileNo: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    flag: {
      type: String,
      required: true,
      default: "PENDING",
      enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED", "IN_REVIEW"],
    },

    personalInfo: {
      gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHER"],
      },
      dateOfBirth: Date,
      nationality: {
        type: String,
        default: "INDIAN",
      },
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
      panNumber: {
        type: String,
        uppercase: true,
      },
      aadhaarNumber: String,

      // Occupation Details
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
      employerName: String,
      designation: String,
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
      isApproved: {
        type: Boolean,
        default: false,
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
      reviewedAt: Date,
      rejectionReason: String,
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
