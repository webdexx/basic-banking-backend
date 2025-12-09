const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const User = require("./models/User");
const Account = require("./models/Account");
const Transaction = require("./models/Transaction");

const auth = require("./middleware/auth");
const requireKYC = require("./middleware/requireKYC");

const app = express();

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "https://localhost:5500", "http://127.0.0.1:5500"],
  credentials: true
}));

connectDB();

app.use("/register", require("./routes/userRoute"));
app.use("/kyc", auth, require("./routes/kycRoute"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/account", auth, requireKYC, require("./routes/accountRoute"));
app.use("/transactions", auth, require("./routes/transactionRoute"));
app.use("/cards", auth, require("./routes/cardRoute"));

app.get("/", auth, (async (req, res) => {
    
    const userDetails = req.user;
    res.json({ 
        message: "Hello From Home",
        userDetails
        });
}));

app.listen(3000, () => console.log(`Server is up and running on 3000`));