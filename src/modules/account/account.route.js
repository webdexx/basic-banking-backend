const express = require("express");
const router = express.Router();

const { createAccount, showAccount } = require("./account.controller");
const requireKYC = require("../../middleware/requireKYC");
const auth = require("../users/auth/auth.middleware");

router.post("/new", auth, requireKYC, createAccount);
router.get("/show", auth, showAccount);

module.exports = router;