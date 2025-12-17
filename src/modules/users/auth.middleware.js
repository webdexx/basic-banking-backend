const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.accessToken;
  //const token = req.header("Authorization");

  console.log("Cookies:", req.cookies);

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    console.log("Cookies: ", req.cookies)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = auth;