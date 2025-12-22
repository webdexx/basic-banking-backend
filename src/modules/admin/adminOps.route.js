const express = require("express");
const router = express.Router();

const adminAuth = require("./adminAuth.middleware");
const { getUsers, getAccounts, getTransactions } = require("./adminOps.controller");

router.get("/get-users", adminAuth, getUsers);

router.get("/get-accounts", adminAuth, getAccounts);

router.get("/get-txns", adminAuth, getTransactions);

module.exports = router;