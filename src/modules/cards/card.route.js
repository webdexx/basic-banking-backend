const express = require("express");
const router = express.Router();

const { createCard, showCard } = require("./card.controller");

router.post("/generate-card", createCard);
router.get("/my-card", showCard);

module.exports = router;