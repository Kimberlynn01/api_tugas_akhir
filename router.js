const express = require("express");
const router = express.Router();
const userRoute = require("./user");
const albumRoute = require("./album");
const fotoRouter = require("./foto");
const likeFotoRouter = require("./like_foto");
const komentar = require("./komentar");

// router for user
router.use("/user", userRoute);

// router for album
router.use("/album", albumRoute);

// router for foto
router.use("/foto", fotoRouter);

// router for like foto
router.use("/liked", likeFotoRouter);

// router fot komentar
router.use("/komentar", komentar);
module.exports = router;
