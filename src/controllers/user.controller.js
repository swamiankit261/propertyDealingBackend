const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");

export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, mobileNo, companyName, address, roleOf } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const Fields = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        mobileNo: mobileNo,
        companyName: companyName,
        address: address,
        roleOf: roleOf
    }

    const user = await User.create(Fields)


    res.status(201).json(new ApiResponse(201, user, "user registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email && !password) {
        throw new ApiError(400, "Email and password must be required")
    }

    const user = await User.findOne(email).select("+password")

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password");
    }

    const token = user.generateAccessToken();

    res.status(200).cookie("accessToken", token)
        .json(new ApiResponse(200, token, "user logged in successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken");
    res.status(200).json(new ApiResponse(200, "user logged out successfully"));
});

export const changeCurrentUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword && !newPassword) {
        throw new ApiError(403, "old password and new password is required")
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password cannot be same as old password")
    }

    const user = await User.findById(req.user._id).select("+password")

    const isValidPassword = await user.isPasswordCorrect(oldPassword);

    if (!isValidPassword) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json(new ApiResponse(200, {}, "password changed successfully"));
});