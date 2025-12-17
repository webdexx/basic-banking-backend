const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const helmet = require("helmet");
const rateLimiter = require("./middleware/rateLimiter");
const compression = require("compression");

const mongoose = require("mongoose");
const connectDB = require("./config/db");

const User = require("./modules/users/user.model");
const Account = require("./modules/account/account.model");
const Transaction = require("./modules/transactions/transaction.model");

const auth = require("./modules/users/auth.middleware");
const requireKYC = require("./middleware/requireKYC");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(compression());

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

connectDB();

app.use("/register", rateLimiter, require("./modules/users/user.route"));
app.use("/kyc", auth, rateLimiter, require("./modules/users/kyc.route"));
app.use("/auth", rateLimiter, require("./modules/users/auth.route"));
app.use("/account", auth, requireKYC, rateLimiter, require("./modules/account/account.route"));
app.use("/transactions", auth, rateLimiter, require("./modules/transactions/transaction.route"));
app.use("/cards", auth, rateLimiter, require("./modules/cards/card.route"));

app.get("/", auth, (async (req, res) => {

  const userDetails = req.user;
  res.json({
    message: "Hello From Home",
    userDetails
  });
}));

app.listen(3000, () => console.log(`Server is up and running on 3000`));