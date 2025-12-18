const express = require("express");
const router = express.Router();

const { addBeneficiary, showBeneficiaries } = require("./beneficiary.controller");

const requireKYC = require("../../middleware/requireKYC");
const auth = require("../users/auth.middleware");

router.post("/add", auth, requireKYC, addBeneficiary);
router.get("/get", auth, showBeneficiaries);

module.exports = router;