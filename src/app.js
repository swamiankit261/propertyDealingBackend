const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");


const app = express();

// middlewares for express middlewares that require authentication and authorization for the application to use
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: "16kb" }));

// To understand URL patterns
app.use(express.urlencoded({ limit: "16kb", extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

// Routes imports
const userRoutes = require("./routes/user.routes");
const propertyRoutes = require("./routes/property.routes");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/property", propertyRoutes);



module.exports = app