const UserDetails = require("./userDetails.model");
const User = require("../user.model");

const getUserKycService = async ({ userId }) => {

    const kycData = await UserDetails.find({ user: userId });
    const personalData = await User.findById(userId);

    if (!kycData.length) {
        return {
            status: "NO_KYC_INFO_AVAILABLE",
        };
    }

    const userPersonalInfo = kycData[0].personalInfo;
    const userProfessionalInfo = kycData[0].documents;

    if (!userProfessionalInfo) {
        return {
            status: "DOCUMENTS_PENDING",
        };
    }

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

    return {
        status: "DATA_FETCHED",
        userData
    };
};

const getKycStatusService = async ({ userId }) => {
    
        const userKycStatus = await UserDetails.findOne({ user: userId });

        if (!userKycStatus) {
            return {
                status: "KYC_STATUS_NOT_AVAILABLE",
            };
        }

        return {
            status: "KYC_FETCH_SUCCESS",
            kycStatus: userKycStatus.kycStatus
        }
};

module.exports = { getUserKycService, getKycStatusService };