const { loginService } = require("./auth.service");
const User = require("../user.model");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await loginService({
      email, password
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).json({
      message: "Login Successful",
      flag: user.flag,
    });

  } catch (error) {
    switch (error.message) {
      case "NOT_FOUND":
        return res.status(404).json({
          message: "User not Found",
        });

      case "INVALID_PASSWORD":
        return res.status(401).json({
          message: "Invalid Password"
        });

      default:
        return res.status(500).json({
          message: "Internal Server Error",
          error: error.message,
        });
    }
  }
};

const logout = async (req, res) => {

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({
    message: "Logged Out Success"
  })
};

module.exports = { login, logout };
