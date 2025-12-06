const express = require("express");
const router = express.Router();

const { createCard, showCard } = require("../controllers/cardController");

router.post("/generate-card", createCard);
router.get("/show-card", showCard);

module.exports = router;