const { updatePasswordService } = require("./userSecurity.service");

const updatePassword = async (req, res) => {
  try{
    const { newPassword, oldPassword } = req.body;
    const userId = req.user.id;

    await updatePasswordService({
      userId,
      oldPassword,
      newPassword,
    });

    return res.status(200).json({
      message: "Password Updated Successfully",
    });
    
  } catch (error) {
    switch (error.message) {
      case "BOTH_PASSWORDS_REQUIRED":
        return res.json({
          message: "Both old and new password are required"
        });
      case "PASSWORD_TOO_SHORT":
        return res.json({
          message: "New password should be more than 6 characters"
        });
      case "INVALID_OLD_PASSWORD":
        return res.json({
          message: "Old Password do not match with existing password"
        });
      case "USER_NOT_FOUND":
        return res.json({
          message: "Unable to fetch the user"
        });
      default: 
      return res.status(500).json({
        message: "Internal Server Error"
      });
    }
  }
};

module.exports = {
  updatePassword,
};