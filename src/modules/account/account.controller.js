const Account = require("./account.model");
const User = require("../users/user.model");

const createAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { balance = 0 } = req.body;

    newAccountNumber = Math.floor(Math.random() * 1000000);

    const existingAccount = await Account.findOne({ user: userId });

    if (existingAccount) {
      return res.status(400).json({
        message: "User Already has an account",
        account: {
          accountNumber: existingAccount.accountNumber,
          name: fullName || "",
          branch: existingAccount.branch,
          status: existingAccount.status,
        },
      });
    }

    const createNewAccount = await Account.create({
      accountNumber: `50010121${newAccountNumber}`,
      ifsc: "ABCD000111",
      branch: "BasicBanking Local",
      balance: parseFloat(balance),
      blockedAmount: 0,
      status: "ACTIVE",
      user: userId,
    });

    await User.findOneAndUpdate(
      { _id: userId },
      {
        flag: "APPROVED",
      },
      { new: true }
    );

    return res.status(201).json({
      message: "Account Created Successfully",
      account: {
        accountNumber: createNewAccount.accountNumber,
        name: fullName || "",
        ifsc: createNewAccount.ifsc,
        branch: createNewAccount.branch,
        balance: createNewAccount.balance,
        availableBalance: createNewAccount.availableBalance,
        status: createNewAccount.status,
        accountType: createNewAccount.accountType,
        openedDate: createNewAccount.openedDate,
      },
      nextSteps: [
        "Your account is now active",
        "You can start making transactions immediately",
        "Visit your dashboard to view account details",
        "You can generate a new Card from your Dashboard",
      ],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const showAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const accountDetails = await Account.findOne({ user: userId });

    const user = await User.findById(userId).select("firstName lastName name");
    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return res.status(200).json({
      message: "Fetch Successful",
      accountDetails,
      fullName
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { createAccount, showAccount };
