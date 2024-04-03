const express = require('express');
const { registerUser, loginUser, logoutUser, changeCurrentUserPassword } = require('../controllers/user.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');
const { body } = require("express-validator");
const validateRegisterFields = require('../middlewares/validatApiRequest');

const R = express.Router();


R.route("/register").post(validateRegisterFields, registerUser)
R.route("/login").get(loginUser)

// SECURED ROUTES
R.route("/logout").post(verifyJWT, logoutUser)
R.route("/resetPassword").patch(verifyJWT, changeCurrentUserPassword)

module.exports = R;