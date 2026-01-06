const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("./admin.model");

const adminLoginService = async ({ email, mobileNo, password, pin }) => {
  if (!email && !mobileNo) {
    return {
      status: "USERID_REQUIRED",
    };
  }

  if (!password) {
    return {
      status: "PASSWORD_REQUIRED",
    };
  }

  if (!pin) {
    return {
      status: "PIN_REQUIRED",
    };
  }

  const admin = await Admin.findOne({
    $or: [{ email }, { mobileNo }],
  }).populate("_id isActive fullName email mobileNo role");

  if (!admin) {
    return {
      status: "ADMIN_NOT_FOUND",
    };
  }

  if (!admin.isActive) {
    return { status: "ADMIN_INACTIVE" };
  }

  const comparePassword = await bcrypt.compare(password, admin.password);
  const comparePin = await bcrypt.compare(pin.toString(), admin.pin);

  if (!comparePassword) {
    return {
      status: "INVALID_PASSWORD",
    };
  }

  if (!comparePin) {
    return {
      status: "INVALID_PIN",
    };
  }

  const adminToken = jwt.sign(
    { id: admin._id, role: admin.role, type: "ADMIN" },
    process.env.JWT_ADMIN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return {
    status: "LOGIN_SUCCESS",
    adminToken,
    admin: {
      adminId: admin._id,
      status: admin.isActive,
      role: admin.role,
      name: admin.fullName,
      email: admin.email,
      mobileNo: admin.mobileNo
    },
  };
};

const adminLoginRefreshService = async ({ pin, adminToken }) => {
  if (!pin) {
    return {
      status: "PIN_REQUIRED",
    };
  }

  if (!adminToken) {
    return {
      status: "NO_TOKEN",
    };
  }

  const decoded = jwt.verify(adminToken, process.env.JWT_ADMIN_SECRET);
  const admin = await Admin.findById(decoded.id);

  const comparePin = await bcrypt.compare(pin, admin.pin);

  if (!comparePin) {
    return {
      status: "INVALID_PIN",
    };
  }

  return true;
};

const adminLogoutService = async (res) => {
    res.clearCookie("adminToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return true;
}

module.exports = { adminLoginService, adminLoginRefreshService, adminLogoutService };
