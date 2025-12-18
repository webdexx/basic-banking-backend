const express = require("express");
const router = express.Router();

const { updatePassword } = require("./userManagement.controller");
const auth = require("../auth.middleware");

router.put("/update-password", auth, updatePassword);

module.exports = router;