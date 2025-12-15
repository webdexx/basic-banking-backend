const express = require("express");
const router = express.Router();

const { registerUser } = require("./user.controller");

router.post("/", registerUser);

module.exports = router;