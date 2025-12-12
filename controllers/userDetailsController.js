const UserDetails = require("../models/UserDetails");
const User = require("../models/User");

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

    const userDetails = await UserDetails.findOne({ user: userId });

    const kycState = userDetails?.kycStatus || {};

    if (kycState.personalInfo === "COMPLETE") {
      return res.status(400).json({
        message:
          "Personal Information Already Available. Please finish documents Form",
        personalInfo: userDetails.personalInfo,
      });
    }

    const finalCorrespondenceAddress = correspondenceAddress?.sameAsPermanent
      ? {
          sameAsPermanent: true,
          street: permanentAddress?.street,
          city: permanentAddress?.city,
          state: permanentAddress?.state,
          pincode: permanentAddress?.pincode,
          country: permanentAddress?.country,
        }
      : correspondenceAddress;

    const parseDate = (dob) => {
      if (!dob) return undefined;

      if (typeof dob === "string" && dob.includes("/")) {
        const [day, month, year] = dob.split("/");

        const date = new Date(year, month - 1, day, 12, 0, 0);

        return date.toISOString().split("T")[0];
      }

      return dob;
    };

    const payload = {
      $set: {
        user: userId,

        personalInfo: {
          gender,
          dateOfBirth: dob ? parseDate(dob) : undefined,
          nationality,
          permanentAddress: {
            street: permanentAddress?.street,
            city: permanentAddress?.city,
            state: permanentAddress?.state,
            pincode: permanentAddress?.pincode,
            country: permanentAddress?.country,
          },
          correspondenceAddress: finalCorrespondenceAddress,
        },

        kycStatus: {
          personalInfo: "COMPLETE",
          documents: "ACTIVE",
          overallStatus: "PENDING",
        },
        isFilled: true,
      },
    };

    const personalInfo = await UserDetails.findOneAndUpdate(
      { user: userId },
      payload,
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    return res.status(201).json({
      message: "Personal Info Added Successfully",
      personalInfo: personalInfo.personalInfo,
    });
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

    if (!panNumber || !aadhaarNumber || !occupation || !monthlyIncome) {
      return res.status(400).json({
        message:
          "All document fields are required: PAN, Aadhaar, Occupation, Monthly Income",
      });
    }

    const userId = req.user.id;

    const userDetails = await UserDetails.findOne({ user: userId });

    const kycState = userDetails?.kycStatus;

    if (kycState.documents === "COMPLETE") {
      return res.status(400).json({
        message:
          "Documents form already submitted. Please wait for the admin to review",
      });
    }

    const payload = {
      $set: {
        user: userId,

        documents: {
          panNumber,
          aadhaarNumber,
          occupation,
          monthlyIncome,
        },

        kycStatus: {
          personalInfo: "COMPLETE",
          documents: "COMPLETE",
          overallStatus: "PENDING_REVIEW",
        },

        // Don't touch personalInfo status here; let it reflect actual state
        isFilled: true,
      },
    };

    const documentsInfo = await UserDetails.findOneAndUpdate(
      { user: userId },
      payload,
      {
        upsert: false,
        new: true,
      }
    );

    if (!documentsInfo) {
      return res.status(400).json({
        message: "Complete personal details before submitting documents",
      });
    }

    return res.status(201).json({
      message: "Documents Added Successfully",
      documentsInfo: documentsInfo.documents,
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

    const kycData = await UserDetails.find({ user: userId });
    const personalData = await User.findById(userId);

    const userPersonalInfo = kycData[0].personalInfo;
    const userProfessionalInfo = kycData[0].documents;

    const userData = {
      userFullname: `${personalData.firstName} ${personalData.lastName}`,
      userEmail: personalData.email,
      userMobile: personalData.mobileNo,
      userStatus: personalData.isActive,
      userPermanentAddress: `${userPersonalInfo.permanentAddress.street}, ${userPersonalInfo.permanentAddress.city}, ${userPersonalInfo.permanentAddress.state} - ${userPersonalInfo.permanentAddress.pincode}, ${userPersonalInfo.permanentAddress.country}`,
      userCorrespondenceAddress: `${userPersonalInfo.correspondenceAddress.street}, ${userPersonalInfo.correspondenceAddress.city}, ${userPersonalInfo.correspondenceAddress.state} - ${userPersonalInfo.correspondenceAddress.pincode}, ${userPersonalInfo.correspondenceAddress.country}`,
      userGender: userPersonalInfo.gender,
      userDOB: userPersonalInfo.dateOfBirth,
      userPAN: userProfessionalInfo.panNumber,
      userAadhar: userProfessionalInfo.aadhaarNumber,
      userOccupation: userProfessionalInfo.occupation,
      userMonthlyIncome: userProfessionalInfo.monthlyIncome
    }

    return res.status(200).json({
      message: "Data Fetched Successfully",
      userData
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

    const userKycStatus = await UserDetails.findOne({ user: userId });

    if(!userKycStatus) {
        return res.status(404).json({
            message: "User KYC not found",
            userKycStatus: null
        })
    }

    return res.status(200).json({
      message: "Data Fetched Successfully",
      userKycStatus: userKycStatus.kycStatus
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { personalDetailsKYC, documentsKYC, getUserKyc, getKycStatus };
