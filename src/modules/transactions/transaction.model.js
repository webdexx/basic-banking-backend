const mongoose = require("mongoose");
const crypto = require("crypto");

const makeTxRef = () => crypto.randomBytes(12).toString("hex").toUpperCase();

const transactionSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAW", "TRANSFER_OUT", "TRANSFER_IN"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Transaction amount must be positive"],
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    // For outgoing transfers (sender side)
    beneficiaryDetails: {
      accountNumber: {
        type: String,
        trim: true,
      },
      ifscCode: {
        type: String,
        trim: true,
        uppercase: true,
      },
      name: {
        type: String,
        trim: true,
      },
      branch: {
        type: String,
        trim: true,
      },
    },
    
    // For incoming transfers (receiver side)
    senderDetails: {
      accountNumber: {
        type: String,
        trim: true,
      },
      ifscCode: {
        type: String,
        trim: true,
        uppercase: true,
      },
      name: {
        type: String,
        trim: true,
      }
    },
    
    // Reference to link both sides of the transfer
    linkedTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    transactionReference: {
      type: String,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "CANCELLED"],
      default: "COMPLETED",
    },
    
    category: {
      type: String,
      enum: [
        "SELF_TRANSFER",      // Same bank transfer
        "IMPS",               // Immediate Payment Service
        "NEFT",               // National Electronic Funds Transfer
        "RTGS",               // Real Time Gross Settlement
        "UPI",                // Unified Payments Interface
        "CASH_DEPOSIT",       // Cash deposit
        "CASH_WITHDRAWAL",    // Cash withdrawal
        "BILL_PAYMENT",       // Utility bill payment
        "OTHER"               // Other transactions
      ],
      default: "OTHER",
    },
    
    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.pre("validate", function (next) {
  if (!this.transactionReference) {
    this.transactionReference = makeTxRef();
  }
});


transactionSchema.virtual("transactionType").get(function () {
  const typeMap = {
    DEPOSIT: "Deposit",
    WITHDRAW: "Withdrawal",
    TRANSFER_OUT: "Money Sent",
    TRANSFER_IN: "Money Received",
  };
  return typeMap[this.type] || this.type;
});

transactionSchema.virtual("counterparty").get(function () {
  if (this.type === "TRANSFER_OUT" && this.beneficiaryDetails) {
    return this.beneficiaryDetails.name || this.beneficiaryDetails.accountNumber;
  }
  if (this.type === "TRANSFER_IN" && this.senderDetails) {
    return this.senderDetails.name || this.senderDetails.accountNumber;
  }
  return null;
});

//expose virtuals in JSON responses
transactionSchema.set("toJSON", { virtuals: true });
transactionSchema.set("toObject", { virtuals: true });

// Indexes for better query performance
transactionSchema.index({ user: 1, createdAt: -1 }); // User's transaction history
transactionSchema.index({ account: 1, createdAt: -1 }); // Account statement
transactionSchema.index({ "beneficiaryDetails.accountNumber": 1 }); // Search by beneficiary
transactionSchema.index({ "senderDetails.accountNumber": 1 }); // Search by sender
transactionSchema.index({ type: 1, status: 1, createdAt: -1 }); // Filter by type and status
transactionSchema.index({ transactionReference: 1 }, { unique: true });

// Method to check if transaction is a transfer
transactionSchema.methods.isTransfer = function () {
  return this.type === "TRANSFER_OUT" || this.type === "TRANSFER_IN";
};

//proper static to get both sides of a transfer (by id or reference)
transactionSchema.statics.getTransferPair = async function (identifier) {
  // identifier can be a transactionReference string OR an ObjectId string
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
  if (isObjectId) {
    // find by id, then use transactionReference or linkedTransactionId to fetch pair
    const tx = await this.findById(identifier).lean();
    if (!tx) return [];

    return this.find({ transactionReference: tx.transactionReference }).sort({ createdAt: 1 });
  } else {
    // assume it's a transactionReference
    return this.find({ transactionReference: identifier }).sort({ createdAt: 1 });
  }
};


const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
