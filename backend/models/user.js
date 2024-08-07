const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter your name"],
		maxLength: [30, "Name cannot exceed 30 characters"],
		minLength: [4, "Name should have more than 4 characters"],
	},
	email: {
		type: String,
		required: [true, "Please enter your email"],
		unique: true,
		validate: [validator.isEmail, "Please enter a valid email"],
	},
	password: {
		type: String,
		required: [true, "Please enter your password"],
		minLength: [6, "Password should be greater than 6 characters"],
		select: false,
	},
	avatar: {
		public_id: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	role: {
		type: String,
		default: "user",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
// userSchema.methods.getJWTToken = function () {
// 	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
// 		expiresIn: process.env.JWT_EXPIRE,
// 	});
// };

userSchema.methods.getJWTToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: parseInt(process.env.JWT_EXPIRE, 10),
    });
    const decoded = jwt.decode(token);
    console.log('Token will expire at:', new Date(decoded.exp * 1000));
    return token;
};


// compare password
userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

// reset password token
userSchema.methods.getResetPasswordToken = function () {
	// generating token
	const resetToken = crypto.randomBytes(20).toString("hex");

	// hashing and adding resetPasswordToken to user schema
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
	return resetToken;
};

module.exports = mongoose.model("User", userSchema);
