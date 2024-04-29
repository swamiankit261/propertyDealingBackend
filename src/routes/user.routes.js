const express = require('express');
const { registerUser, loginUser, logoutUser, changeCurrentUserPassword } = require('../controllers/user.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');
const validateRegisterFields = require('../middlewares/validatUserApiRequest');

const R = express.Router();


R.route("/register").post(validateRegisterFields, registerUser)
R.route("/login").get(loginUser)

// SECURED ROUTES
R.route("/logout").post(verifyJWT, logoutUser)
R.route("/resetPassword").patch(verifyJWT, changeCurrentUserPassword)

module.exports = R;