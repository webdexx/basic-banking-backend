const UserDetails = require("../modules/users/kyc/userDetails.model");

const requireKYC = async (req, res, next) => {
  const userId = req.user.id;
  const userDetails = await UserDetails.findOne({ user: userId });
  console.log("Require KYC Called");

  if (!userDetails) {
    return res.status(400).json({
      message: "No KYC Found for this account. Please complete KYC Step first",
    });
  }

  const kycOverallStatus = userDetails.kycStatus?.overallStatus;

  if (kycOverallStatus === "PENDING") {
    return res.status(403).json({
      message:
        "Your KYC is Pending. Please Complete the KYC process from your profile.",
    });
  }

  if (kycOverallStatus === "REJECTED") {
    return res.status(403).json({
      message:
        "Your KYC has been rejected. Please restart the KYC process from your profile.",
    });
  }

  if (kycOverallStatus === "ON_HOLD") {
    return res.status(200).json({ message: "Your KYC is on Hold", kycStatus });
  }

  if (kycOverallStatus === "PENDING_REVIEW") {
    return res.status(403).json({
      message:
        "Your KYC is being reviewed. Please Check your mail for further details",
    });
  }

  return next();
};
module.exports = requireKYC;
