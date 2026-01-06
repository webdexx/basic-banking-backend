const bcrypt = require("bcryptjs");
const User = require("../user.model");

const updatePasswordService = async ({ userId, oldPassword, newPassword }) => {
  if (!oldPassword || !newPassword) {
    throw new Error("BOTH_PASSWORDS_REQUIRED");
  }

  if (newPassword.length < 6) {
    throw new Error("PASSWORD_TOO_SHORT");
  }

  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new Error("USER_NOT_FOUND");
  }

  const comparePassword = await bcrypt.compare(
    oldPassword,
    existingUser.password
  );

  if (!comparePassword) {
    throw new Error("INVALID_OLD_PASSWORD");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });

  return true;
};

module.exports = {
  updatePasswordService,
};
