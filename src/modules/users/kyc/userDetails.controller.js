const { personalDetailsService } = require("./personalDetails.service");
const { documentsKYCService } = require("./professionalDetails.service");
const { getKycStatusService, getUserKycService } = require("./getKyc.service");

const personalDetailsKYC = async (req, res) => {
  try {
    const {
      gender,
      dob,
      nationality,
      permanentAddress,
      correspondenceAddress,
    } = req.body;

    const userId = req.user.id;

    const result = await personalDetailsService({
      userId, gender, dob, nationality, permanentAddress, correspondenceAddress
    });

    if (result.status === "PERSONAL_INFO_AVAILABLE") {
      return res.status(409).json({
        message: "Personal Info Already available, please proceed with documents",
        personalInfo: result.personalInfo,
      });
    }

    if (result.status === "PERSONAL_INFO_CREATED") {
      return res.status(201).json({
        message: "Personal Info Added Successfully",
        personalInfo: result.personalInfo,
      });
    }

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const documentsKYC = async (req, res) => {
  try {
    const { panNumber, aadhaarNumber, occupation, monthlyIncome } = req.body;

    const userId = req.user.id;

    const result = await documentsKYCService({
      userId,
      panNumber,
      aadhaarNumber,
      occupation,
      monthlyIncome
    });

    if (result.status === "DOCUMENTS_INFO_AVAILABLE")
      return res.status(409).json({
        message: "Professional Info Already Available. Wait for Approval"
      });

    if (result.status === "PERSONAL_INFO_PENDING")
      return res.status(400).json({
        message: "Please complete Personal Info before Professional Info"
      });

    if (result.status === "DOCUMENT_ADDED_SUCCESSFULLY")
      return res.status(201).json({
        message: "Documents Added Successfully"
      });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getUserKyc = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await getUserKycService({
      userId
    });

    return res.status(200).json({
      message: "Data Fetched Successfully",
      userData: result.userData
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getKycStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await getKycStatusService({ userId });

    if (result.status === "KYC_STATUS_NOT_AVAILABLE") {
      return res.status(404).json({
        message: "KYC Status Not Available",
      });
    }

    if (result.status === "KYC_FETCH_SUCCESS") {
      return res.status(200).json({
        message: "Data Fetched Successfully",
        userKycStatus: result.kycStatus
      });
    }

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { personalDetailsKYC, documentsKYC, getUserKyc, getKycStatus };
