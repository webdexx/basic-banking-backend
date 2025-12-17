const mongoose = require("mongoose");

const benSchema = new mongoose.Schema(
    {
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true
        },
        benName: {
            type: String,
            required: true,
        },
        benAccountNo: {
            type: String,
            required: true,
        },
        benIfsc: {
            type: String,
            required: true,
        }
    }
);

const Beneficiary = mongoose.model("Beneficiary", benSchema);

module.exports = Beneficiary;