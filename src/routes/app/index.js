
const authRoutes = require("../app/auth")

const commentsRoutes = require("../app/comments")

const challangesRoutes = require("../app/challanges")

const teamsRoutes = require("../app/teams")

const playersRoutes = require("../app/player")

const refreeRoutes = require("../app/refree")


const notifcationsRoutes = require("../app/notifcations")


const express = require("express");
const router = express.Router();

router.use("/auth", authRoutes);

router.use("/comments", commentsRoutes);

router.use("/notifcations", notifcationsRoutes);

router.use("/challanges", challangesRoutes);

router.use("/teams", teamsRoutes);

router.use("/players", playersRoutes);

router.use("/refree", refreeRoutes);


module.exports = router;


