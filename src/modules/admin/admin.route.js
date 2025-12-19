const express = require("express");
const router = express.Router();

const { createNewAdmin } = require("./admin.controller");

router.post("/create", createNewAdmin);

module.exports = router;