const express = require('express');
const { verifyJWT } = require("../middlewares/auth.middleware");
const { registerProperty } = require('../controllers/property.controller');

const R = express.Router();

R.route("/registerProperty").post(verifyJWT, registerProperty);

module.exports = R;