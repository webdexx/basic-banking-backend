const Admin = require("./admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createAdminService = async ({ fullName, email, mobileNo, password, pin, role }) => {

    const existingAdmin = await Admin.findOne({
        $or: [{ email }, { mobileNo }]
    });

    if (existingAdmin) {
        return {
            status: "ADMIN_EXISTS"
        };
    }

    if (password.length < 8) {
        return { status: "WEAK_PASSWORD" };
    }

    if (!/^[0-9]{4}$/.test(pin)) {
        return { status: "INVALID_PIN" };
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const hashedPin = await bcrypt.hash(pin.toString(), 10);

    const allowedRoles = ["SUBADMIN", "MANAGER", "OTHER"];

    if (!allowedRoles.includes(role)) {
        return { status: "INVALID_ROLE" };
    }


    const newAdmin = await Admin.create({
        fullName,
        email,
        mobileNo,
        password: hashedPassword,
        pin: hashedPin,
        role: role || "OTHER",
        isActive,
    });

    return {
        status: "SUCCESS",
        admin: {
            id: newAdmin._id,
            name: newAdmin.fullName,
            email: newAdmin.email,
            role: newAdmin.role
        }
    }

}

module.exports = { createAdminService };