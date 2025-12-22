const Beneficiary = require("./beneficiary.model");
const Account = require("../account/account.model");

const addBeneficiary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { benName, benAccountNo, benIfsc } = req.body;

        // 1️⃣ Find user's account
        const account = await Account.findOne({ user: userId });

        if (!account) {
            return res.status(404).json({
                message: "Account not found",
            });
        }

        if (account.status !== "ACTIVE") {
            return res.status(403).json({
                message: "Account is not active",
            });
        }

        // 2️⃣ Create beneficiary (linked to account)
        const beneficiary = await Beneficiary.create({
            account: account._id,
            benName,
            benAccountNo,
            benIfsc,
        });

        return res.status(201).json({
            message: "Beneficiary created successfully",
            beneficiary,
        });

    } catch (error) {
        // Duplicate beneficiary (based on compound index)
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Beneficiary already exists for this account",
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const showBeneficiaries = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1️⃣ Find user's account
        const account = await Account.findOne({ user: userId });

        if (!account) {
            return res.status(404).json({
                message: "Account not found",
            });
        }

        // 2️⃣ Fetch ALL beneficiaries for this account
        const beneficiaries = await Beneficiary.find({
            account: account._id,
        });

        return res.status(200).json({
            message: "Fetch successful",
            beneficiaries,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

module.exports = { addBeneficiary, showBeneficiaries };
