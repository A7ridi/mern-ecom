const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandlers");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
	const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
		folder: "avatars",
		width: 150,
		crop: "scale",
	});

	const { name, email, password } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: myCloud.public_id,
			url: myCloud.secure_url,
		},
	});

	sendToken(user, 201, res);
});

// login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ErrorHandler("Please enter email & password", 400));
	}

	const user = await User.findOne({ email }).select("+password");

	if (!user) {
		return next(new ErrorHandler("Invalid email or password", 401));
	}

	const isPasswordMatched = await bcrypt.compare(password, user.password);

	if (!isPasswordMatched) {
		return next(new ErrorHandler("Invalid email or password", 401));
	}

	sendToken(user, 200, res);
});

// Logout user
exports.logout = catchAsyncErrors(async (req, res, next) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: "Logged Out",
	});
});

// forgot user
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorHandler("User not found", 404));
	}

	// get resetpassword token
	const resetToken = user.getResetPasswordToken();
	await user.save({ validateBeforeSave: false });

	// const resetPasswordUrl = `${process.env.FRONTEND_TEST_URL}/password/reset/${resetToken}`;
	const resetPasswordUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/password/reset/${resetToken}`;

	const message = `Your reset password link -> \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

	try {
		await sendEmail({
			email: user.email,
			subject: `${process.env.COMPANY_NAME} password recovery`,
			message,
		});

		res.status(200).json({
			success: true,
			message: `Email sent to ${user.email} successfully`,
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorHandler(error.message, 500));
	}
});

// reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
	// creating token hash
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(
			new ErrorHandler("Reset password link is invalid or expired", 400)
		);
	}

	if (req.body.password !== req.body.confirmPassword) {
		return next(new ErrorHandler("Password does not match", 400));
	}

	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

	sendToken(user, 200, res);
});

// get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		user,
	});
});

// update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
	const { oldPassword, newPassword, confirmPassword } = req.body;
	const user = await User.findById(req.user.id).select("+password");

	const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

	if (!isPasswordMatched) {
		return next(new ErrorHandler("Old password is incorrect", 400));
	}

	if (newPassword !== confirmPassword) {
		return next(new ErrorHandler("Password does not match", 400));
	}

	user.password = newPassword;

	await user.save();

	sendToken(user, 200, res);
});

// update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
	const { name, email } = req.body;

	const newUserData = {
		name,
		email,
	};

	if (req.body.avatar !== "") {
		const user = await User.findById(req.user.id);
		const imageId = user.avatar.public_id;
		await cloudinary.v2.uploader.destroy(imageId);
		const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
			folder: "avatars",
			width: 150,
			crop: "scale",
		});

		newUserData.avatar = {
			public_id: myCloud.public_id,
			url: myCloud.secure_url,
		};
	}

	const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
		user,
	});
});

// get all users (admin)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({
		success: true,
		users,
	});
});

// get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorHandler("User does not exist", 404));
	}

	res.status(200).json({
		success: true,
		user,
	});
});

// update user role (admin)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
	const { name, email, role } = req.body;

	const newUserData = { name, email, role };

	let user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorHandler("User does not exist", 404));
	}

	user = await User.findByIdAndUpdate(req.params.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({
		success: true,
		user,
	});
});

// delete user profile (admin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorHandler("User does not exist", 404));
	}

	const imageId = user.avatar.public_id;

	await cloudinary.v2.uploader.destroy(imageId);

	await user.remove();

	res.status(200).json({
		success: true,
		message: "User deleted successfully!",
	});
});
