const {
  adminLoginService,
  adminLoginRefreshService,
} = require("./adminAuth.service");

const adminLogin = async (req, res) => {
  try {
    const { email, mobileNo, password, pin } = req.body;

    const result = await adminLoginService({
      email,
      mobileNo,
      password,
      pin,
    });

    if (result.status === "USERID_REQUIRED") {
      return res.json({
        message: "Email/MobileNo is Required. Please enter any one",
      });
    }

    if (result.status === "PASSWORD_REQUIRED") {
      return res.json({
        message: "Password is Required",
      });
    }

    if (result.status === "PIN_REQUIRED") {
      return res.json({
        message: "Please Enter valid PIN",
      });
    }

    if (result.status === "ADMIN_NOT_FOUND") {
      return res.status(404).json({
        message: "No such Admin Account found",
      });
    }

    if (result.status === "ADMIN_INACTIVE") {
      return res.status(403).json({
        message: "Admin Inactive. Please contact Super Admin",
      });
    }

    if (result.status === "INVALID_PASSWORD") {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }

    if (result.status === "INVALID_PIN") {
      return res.status(401).json({
        message: "Incorrect Pin",
      });
    }

    if (result.status === "LOGIN_SUCCESS") {
      res.cookie("adminToken", result.adminToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60,
      });

      return res.status(200).json({
        message: "Login Success",
        adminId: result.adminId,
        adminStatus: result.adminStatus
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const adminLoginRefresh = async (req, res) => {
  const { pin } = req.body;
  const adminToken =
    req.cookies?.adminToken || req.headers.authorization?.split(" ")[1];

  const result = await adminLoginRefreshService({
    pin,
    adminToken,
  });

  if (!result) {
    res.status(403).json({
      message: "Login Again",
    });
  }

  if (result.status === "INVALID_PIN") {
    res.status(401).json({
      message: "Invalid Pin",
    });
  }

  res.status(200).json({
    message: "Session is valid",
  });
};

module.exports = { adminLogin, adminLoginRefresh };
