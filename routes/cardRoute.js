const express = require("express");
const router = express.Router();

const { createCard, showCard } = require("../controllers/cardController");

router.post("/generate-card", createCard);
router.get("/my-card", showCard);

module.exports = router;