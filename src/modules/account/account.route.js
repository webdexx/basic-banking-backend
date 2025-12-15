const express = require("express");
const router = express.Router();

const { createAccount, showAccount } = require("./account.controller");

router.post("/new", createAccount);
router.get("/show", showAccount);

module.exports = router;