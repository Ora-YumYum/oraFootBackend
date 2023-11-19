
const authRoutes = require("../app/auth")

const commentsRoutes = require("../app/comments")

const challangesRoutes = require("../app/challanges")

const notifcationsRoutes = require("../app/notifcations")


const express = require("express");
const router = express.Router();

router.use("/auth", authRoutes);

router.use("/comments", commentsRoutes);

router.use("/notifcations", notifcationsRoutes);

router.use("/challanges", challangesRoutes);


module.exports = router;


