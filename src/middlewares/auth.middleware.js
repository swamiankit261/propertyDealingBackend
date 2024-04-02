const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization.split(" ")[1] || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "No token provided");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid token");
        }

        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token")
    }
});