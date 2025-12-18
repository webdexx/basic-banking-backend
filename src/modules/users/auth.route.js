const express = require("express");
const router = express.Router();
const { login, logout } = require("./auth.controller");
const auth = require("./auth.middleware");
const User = require("./user.model");

router.post("/login", login);
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("_id email flag role");
  console.log("Auth Hits here");
  res.json({
    user,
  });
});
router.post("/logout", logout);

module.exports = router;