const express = require("express");
const router = express.Router();
const {
  personalDetailsKYC,
  documentsKYC,
  getUserKyc,
  getKycStatus,
} = require("./userDetails.controller");
router.post("/personal-details", personalDetailsKYC);
router.post("/professional-details", documentsKYC);

router.get("/", getUserKyc);
router.get("/status", getKycStatus);
module.exports = router;
