const express = require("express");
const router = express.Router();
const userRoute = require("./user");
const albumRoute = require("./album");

// router for user
router.use("/user", userRoute);

// router for album
router.user("/album", albumRoute);

module.exports = router;
