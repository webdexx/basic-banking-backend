const express = require("express");
const router = express.Router();

const { createNewAdmin } = require("./admin.controller");
const { adminLogin, adminLogout } = require("./adminAuth.controller");
const { adminLoginRefresh } = require("./adminAuth.controller");
const adminAuth = require("./adminAuth.middleware");

router.post("/create", adminAuth, createNewAdmin);
router.post("/login", adminLogin);
router.post("/reAuth", adminAuth, adminLoginRefresh);

router.post("/logout", adminAuth, adminLogout);

module.exports = router;