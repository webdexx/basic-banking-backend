const UserDetails = require("./userDetails.model");
const User = require("../user.model");

const documentsKYCService = async ({ userId, panNumber, aadhaarNumber, occupation, monthlyIncome }) => {

    if (!panNumber || !aadhaarNumber || !occupation || !monthlyIncome) {
        throw new Error("All document fields are required: PAN, Aadhaar, Occupation, Monthly Income");
    }

    const userDetails = await UserDetails.findOne({ user: userId });

    const kycState = userDetails?.kycStatus || {};

    if (!userDetails || userDetails.kycStatus?.personalInfo !== "COMPLETE") {
        return { status: "PERSONAL_INFO_PENDING" };
    }

    if (kycState.documents === "COMPLETE") {
        return {
            status: "DOCUMENTS_INFO_AVAILABLE",
            professionalInfo: kycState.documents
        }
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

    return {
        status: "DOCUMENT_ADDED_SUCCESSFULLY",
        documentsInfo: documentsInfo.documents,
    };
};

module.exports = { documentsKYCService };