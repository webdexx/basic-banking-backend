const User = require("../../users/user.model");
const Account = require("../../account/account.model");
const Transaction = require("../../transactions/transaction.model");

const getUsersService = async () => {
  const users = await User.find(
    {},
    "firstName lastName email mobileNo isActive flag"
  );

  if (users.length === 0) {
    return {
      status: "NOT_FOUND",
    };
  }

  return {
    status: "SUCCESS",
    users,
  };
};

const getAccountsService = async () => {
  try {
    const accounts = await Account.find({}, "user accountNumber status balance");

    if (accounts.length === 0) {
      return {
        success: false,
        status: "NOT_FOUND",
        message: "No accounts found",
        data: []
      };
    }

    const userIds = accounts.map((account) => account.user);

    const users = await User.find(
      { _id: { $in: userIds } },
      "firstName lastName email"
    );

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id] = user;
    });

    const accountsWithUsers = accounts.map((account) => {
      return {
        ...account.toObject(),
        user: userMap[account.user] || null,
      };
    });

    return {
      success: true,
      status: "SUCCESS",
      message: "Accounts fetched successfully",
      count: accountsWithUsers.length,
      data: accountsWithUsers
    };
    
  } catch (error) {
    console.error("Error in getAccountsService:", error);
    return {
      success: false,
      status: "ERROR",
      message: "Failed to fetch accounts",
      error: error.message
    };
  }
};

const getTransactionsService = async () => {
  const transactions = await Transaction.find(
    {},
    "user account type amount balanceAfter beneficiaryDetails senderDetails linkedTransactionId description status category metadata"
  );

  if (transactions.length === 0) {
    return {
      status: "NOT_FOUND",
    };
  }

  return {
    status: "SUCCESS",
    transactions,
  };
};

module.exports = {
  getUsersService,
  getAccountsService,
  getTransactionsService,
};
