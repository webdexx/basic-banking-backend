const express = require("express");
const router = express.Router();

const { createAccount, showAccount } = require("../controllers/accountController");

router.post("/new", createAccount);
router.get("/show", showAccount);

module.exports = router;