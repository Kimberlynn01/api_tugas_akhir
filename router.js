const express = require("express");
const router = express.Router();
const userRoute = require("./user");
const albumRoute = require("./album");
const fotoRouter = require("./foto");
// router for user
router.use("/user", userRoute);

// router for album
router.use("/album", albumRoute);

// router for foto
router.use("/foto", fotoRouter);

module.exports = router;
