const UserDetails = require("./userDetails.model");
const { parseDOB } = require("./parseDOB.util")

const personalDetailsService = async ({ userId, gender, dob, nationality, permanentAddress, correspondenceAddress }) => {

  const userDetails = await UserDetails.findOne({ user: userId });

  const kycState = userDetails?.kycStatus || {};

  if (kycState.personalInfo === "COMPLETE" && userDetails?.personalInfo) {
    return {
      status: "PERSONAL_INFO_AVAILABLE",
      personalInfo: userDetails.personalInfo
    };
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

  const payload = {
    $set: {
      user: userId,

      personalInfo: {
        gender,
        dateOfBirth: dob ? parseDOB(dob) : undefined,
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

  return { 
    status: "PERSONAL_INFO_CREATED",
    personalInfo: personalInfo.personalInfo
   };
};

module.exports = { personalDetailsService };
