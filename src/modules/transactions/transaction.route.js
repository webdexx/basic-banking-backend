const express = require("express");
const router = express.Router();

const { transferMoney, getUserTransactions, getTransactionById } = require("./transaction.controller");

router.post("/send-money", transferMoney);
router.get("/new", (req, res) => {return res.status(403).json({message: "Invalid Request type GET for the endpoint"})});
router.get("/show", getUserTransactions);
router.get("/:id", getTransactionById);

module.exports = router;