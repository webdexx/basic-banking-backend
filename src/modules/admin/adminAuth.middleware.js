const jwt = require("jsonwebtoken");
const Admin = require("../admin/admin.model");

const adminAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.adminToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Admin authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

    if (decoded.type !== "ADMIN") {
      return res.status(403).json({
        message: "Invalid admin token",
      });
    }

    const admin = await Admin.findById(decoded.id).select(
      "_id fullName email role isActive"
    );

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        message: "Admin account is inactive",
      });
    }

    req.user = {
      id: admin._id,
      role: admin.role,
      email: admin.email,
      name: admin.fullName,
      type: "ADMIN",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired admin token",
    });
  }
};

module.exports = { adminAuth };