const express = require('express');
const { verifyJWT } = require("../middlewares/auth.middleware");
const { registerProperty, getSingleProperty } = require('../controllers/property.controller');
const validateRegisterPropertieField = require('../middlewares/validatPropertieApi');


const R = express.Router();

R.route("/registerProperty").post(verifyJWT, validateRegisterPropertieField, registerProperty);

R.route("/property/:id").get(getSingleProperty);



module.exports = R;