const express = require("express");
const router = express.Router();
const userRoute = require("./user");
const albumRoute = require("./album");
const fotoRouter = require("./foto");
const likeFotoRouter = require("./like_foto");
// router for user
router.use("/user", userRoute);

// router for album
router.use("/album", albumRoute);

// router for foto
router.use("/foto", fotoRouter);

// router for like foto
router.use("/liked", likeFotoRouter);

module.exports = router;
