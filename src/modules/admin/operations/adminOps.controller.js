const { getUsersService, getAccountsService, getTransactionsService } = require("./adminOps.service");

const getUsers = async (req, res) => {
  try {
    const result = await getUsersService();

    if (result.status === "NOT_FOUND") {
      return res.status(404).json({
        message: "No Users found",
      });
    }

    if (result.status === "SUCCESS") {
      return res.status(200).json({
        message: "Finding users success",
        data: result.users,
      });
    }
  } catch (error) {
    return res.status(500).json({
        message: "Internal Server Error",
        error: error.message
    })
  }
};

const getAccounts = async (req, res) => {
  try {
    const result = await getAccountsService();

    if (result.status === "NOT_FOUND") {
      return res.status(404).json({
        message: "No Users found",
      });
    }

    if (result.status === "SUCCESS") {
      return res.status(200).json({
        message: "Finding users success",
        count: result.count,
        data: result.data
      });
    }
  } catch (error) {
    return res.status(500).json({
        message: "Internal Server Error",
        error: error.message
    })
  }
};

const getTransactions = async (req, res) => {
  try {
    const result = await getTransactionsService();

    if (result.status === "NOT_FOUND") {
      return res.status(404).json({
        message: "No Users found",
      });
    }

    if (result.status === "SUCCESS") {
      return res.status(200).json({
        message: "Finding users success",
        data: result.transactions,
      });
    }
  } catch (error) {
    return res.status(500).json({
        message: "Internal Server Error",
        error: error.message
    })
  }
};

module.exports = { getUsers, getAccounts, getTransactions };
