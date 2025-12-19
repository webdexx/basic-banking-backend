const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("./admin.model");

const login = async ({ email, mobileNo, password, pin }) => {

    if (!email && !mobileNo) {
        return {
            status: "USERID_REQUIRED",
        };
    }

    if (!password) {
        return {
            status: "PASSWORD_REQUIRED",
        };
    }

    if (!pin) {
        return {
            status: "PIN_REQUIRED",
        };
    }

    const admin = await Admin.findOne({
        $or: [
            { email },
            { mobileNo }
        ]
    });

    if (!admin) {
        return {
            status: "ADMIN_NOT_FOUND"
        }
    }

    if (!admin.isActive) {
        return { status: "ADMIN_INACTIVE" };
    }

    const comparePassword = await bcrypt.compare(password, admin.password);
    const comparePin = await bcrypt.compare(pin.toString(), admin.pin);

    if (!comparePassword) {
        return {
            status: "INVALID_PASSWORD"
        }
    }

    if (!comparePin) {
        return {
            status: "INVALID_PIN"
        }
    }

    const token = jwt.sign({ id: admin._id, role: admin.role, type: "ADMIN" }, process.env.JWT_ADMIN_SECRET, {
        expiresIn: "1h",
    });

    return {
        status: "LOGIN_SUCCESS",
        token
    }
}

module.exports = { login };