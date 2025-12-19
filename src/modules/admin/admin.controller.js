const { createAdminService } = require("./createAdmin.service");

const createNewAdmin = async (req, res) => {
    try {
        const { fullName, email, mobileNo, password, pin, role } = req.body;

        const result = await createAdminService({
            fullName,
            email,
            mobileNo,
            password,
            pin,
            role
        });

        if (result.status === "EMAIL_EXISTS") {
            return res.status(409).json({
                message: "User already exists!",
            })
        }

        if (result.status === "SUCCESS") {
            return res.status(201).json({
                message: "New Admin Created!",
                admin: result.admin
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
};

module.exports = { createNewAdmin };