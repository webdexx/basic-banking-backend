const { createAdminService } = require("./createAdmin.service");

const createNewAdmin = async (req, res) => {
  try {
    const user = req.user.id;
    const { fullName, email, mobileNo, password, pin, role } = req.body;

    const result = await createAdminService({
      user,
      fullName,
      email,
      mobileNo,
      password,
      pin,
      role,
    });

    if (result.status === "ADMIN_EXISTS") {
      return res.status(409).json({
        message: "User already exists!",
      });
    }

    if (result.status === "INVALID_ROLE") {
      return res.status(403).json({
        message: "Only Subadmin, Manager and Other role is allowed!",
      });
    }

    if (result.status === "SUCCESS") {
      return res.status(201).json({
        message: "New Admin Created!",
        admin: result.admin,
      });
    }

    return res.status(400).json({
      message: "Invalid request",
      status: result.status,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { createNewAdmin };
