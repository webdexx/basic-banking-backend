const Account = require("../account/account.model");
const Transaction = require("../transactions/transaction.model");
const User = require("../users/user.model");

function buildName(user) {
  if (!user) return null;
  const first = user.firstName || "";
  const last = user.lastName || "";
  const full = `${first} ${last}`.trim();
  if (full) return full;
  return user.name || null;
}

const transferMoney = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      beneficiaryAccountNumber,
      beneficiaryIFSC,
      beneficiaryName,
      amount,
      description,
      category = "IMPS",
    } = req.body;

    if (!beneficiaryAccountNumber || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid beneficiary account number and amount are required",
      });
    }

    const senderAccount = await Account.findOne({ user: userId }).populate(
      "user",
      "accountNumber ifscCode firstName lastName name"
    );

    if (!senderAccount) {
      return res.status(404).json({
        success: false,
        message: "Sender account not found",
      });
    }

    // Check sufficient balance
    if (senderAccount.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
        currentBalance: senderAccount.balance,
        requiredAmount: amount,
      });
    }

    let beneficiaryAccount = await Account.findOne({
      accountNumber: beneficiaryAccountNumber,
    }).populate("user", "firstName lastName name accountNumber");

    if (!beneficiaryAccount) {
      return res.status(404).json({
        message: "Beneficiary account not found",
      });
    }

    // Generate unique transaction reference
    const generateTransactionReference = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";

      for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      return result;
    };

    const transactionReference = generateTransactionReference();

    const senderBalanceBefore = senderAccount.balance;
    const senderBalanceAfter = senderBalanceBefore - amount;

    // Resolve display names from populated users (fallbacks)
    const senderName = buildName(senderAccount.user) || "Sender";
    const beneficiaryResolvedName =
      beneficiaryName || buildName(beneficiaryAccount.user) || "Beneficiary";

    await Account.findOneAndUpdate(
      { user: userId },
      { balance: senderBalanceAfter }
    );

    const transactionOut = await Transaction.create({
      user: userId,
      account: senderAccount._id,
      type: "TRANSFER_OUT",
      amount: parseFloat(amount),
      balanceBefore: senderBalanceBefore,
      balanceAfter: senderBalanceAfter,
      beneficiaryDetails: {
        accountNumber: beneficiaryAccountNumber,
        ifscCode: beneficiaryIFSC,
        name: beneficiaryName || beneficiaryResolvedName,
        branch: beneficiaryIFSC,
      },
      description: description || `Transfer to ${beneficiaryResolvedName}`,
      category: category,
      status: "COMPLETED",
      transactionReference: transactionReference,
    });

    // Credit beneficiary
    const receiverBalanceBefore = beneficiaryAccount.balance;
    const receiverBalanceAfter = receiverBalanceBefore + amount;

    await Account.updateOne(
      { _id: beneficiaryAccount._id },
      { balance: receiverBalanceAfter }
    );

    // Create receiver transaction
    const transactionIn = await Transaction.create({
      user: beneficiaryAccount.user._id,
      account: beneficiaryAccount._id,
      type: "TRANSFER_IN",
      amount,
      balanceBefore: receiverBalanceBefore,
      balanceAfter: receiverBalanceAfter,
      senderDetails: {
        accountNumber: senderAccount.accountNumber,
        name: senderName || "Sender",
        ifscCode: senderAccount.ifsc,
      },
      description: `Received from ${senderName}`,
      category,
      status: "COMPLETED",
      transactionReference,
      linkedTransactionId: transactionOut._id,
    });

    // Link both transactions
    await Transaction.updateOne(
      { _id: transactionOut._id },
      { linkedTransactionId: transactionIn._id }
    );

    return res.status(201).json({
      message: "Transaction Successful",
      transactionOut,
      transactionIn,
      currentBalance: senderBalanceAfter,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      err: err.message,
    });
  }
};

// Receiver's Function to receive Money from outside

// const receiveMoney = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const {
//       senderAccountNumber,
//       senderIFSC,
//       senderName,
//       amount,
//       description,
//       category = "IMPS",
//     } = req.body;

//   if (!senderAccountNumber || !amount || amount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid sender account number and amount are required",
//       });
//     }

//     const senderAccount = await Account.findOne({ accountNumber: senderAccountNumber });

//     if (!senderAccount) {
//       return res.status(404).json({
//         success: false,
//         message: "Sender account is not valid",
//       });
//     }

//     let beneficiaryAccount = await Account.findOne({ user: userId });

//     let beneficiaryDetails = {
//         accountNumber: beneficiaryAccountNumber,
//         ifscCode: beneficiaryIFSC,
//         name: beneficiaryName || (beneficiaryAccount?.user?.name || "Unknown"),
//         branch: beneficiaryIFSC,
//       };

//     // Generate unique transaction reference
//     const transactionReference = `TRF${Date.now()}${Math.random()
//       .toString(36)
//       .substr(2, 6)
//       .toUpperCase()}`;

//     const senderBalanceBefore = senderAccount.balance;
//     const senderBalanceAfter = senderBalanceBefore - amount;

//     let refreshAccount;

//     refreshAccount = await Account.findOneAndUpdate(
//         { user: userId },
//         {
//           balance: senderBalanceAfter,
//         },
//         { new: true }
//       );

//     const transactionOut = await Transaction.create({
//       user: userId,
//               account: senderAccount._id,
//               type: "TRANSFER_OUT",
//               amount: amount,
//               balanceBefore: senderBalanceBefore,
//               balanceAfter: senderBalanceAfter,
//               beneficiaryDetails: beneficiaryDetails,
//               description: description || `Transfer to ${beneficiaryDetails.name}`,
//               category: category,
//               status: "PENDING",
//               transactionReference: transactionReference,
//               metadata: {
//                 transferType: "CROSS_ACCOUNT",
//                 initiatedBy: userId,
//               },
//     });

//     return res.status(201).json({
//       message: "Transaction Successful",
//       newTransaction,
//       currentBalance: balanceAfter,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error
//     })
//   }
// };

// const createTransaction = async (req, res) => {
//   try {
//     const { type, amount, description } = req.body;

//     if (!amount || !type) {
//       return res.status(400).json({
//         message: "Amount and Type are required",
//       });
//     }

//     if (amount <= 0) {
//       return res.status(400).json({
//         message: "Amount must be greater than 0",
//       });
//     }

//     const userAccount = await Account.findOne({ user: userId });

//     if (!userAccount) {
//       return res.status(400).json({
//         message: "No Account found for this User",
//       });
//     }

//     let balanceAfter;
//     let updatedAccount;

//     if (type.toUpperCase() === "DEPOSIT") {
//       balanceAfter = userAccount.balance + amount;

//       updatedAccount = await Account.findOneAndUpdate(
//         { user: userId },
//         {
//           balance: balanceAfter,
//         },
//         { new: true }
//       );
//     } else if (type.toUpperCase() === "WITHDRAW") {
//       if (amount > userAccount.balance) {
//         return res.status(400).json({
//           message: "Insufficient Balance for Withdrawal",
//           currentBalance: userAccount.balance,
//           attemptedWithdrawal: amount,
//         });
//       }

//       balanceAfter = userAccount.balance - amount;

//       updatedAccount = await Account.findOneAndUpdate(
//         { user: userId },
//         {
//           balance: balanceAfter,
//         },
//         { new: true }
//       );
//     } else {
//       return res.status(400).json({
//         message: "Invalid Transaction Type. Please use 'DEPOSIT' or 'WITHDRAW'",
//       });
//     }

//     const newTransaction = await Transaction.create({
//       type: type.toUpperCase(),
//       amount,
//       balanceBefore: userAccount.balance,
//       balanceAfter: balanceAfter,
//       description,
//       account: userAccount._id,
//       user: userId,
//     });

//     return res.status(201).json({
//       message: "Transaction Successful",
//       newTransaction,
//       currentBalance: balanceAfter,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("account", "accountNumber");

    return res.status(200).json({
      message: "Transactions retrieved successfully",
      transactions: transactions,
      count: transactions.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const tx_id = req.params.id;

    const transaction = await Transaction.findOne({ _id: tx_id });
    return res.status(200).json({
      message: "Transaction retrieved successfully",
      transaction: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { transferMoney, getUserTransactions, getTransactionById };
