
const authRoutes = require("../app/auth")

const commentsRoutes = require("../app/comments")

const challangesRoutes = require("../app/challanges")

const teamsRoutes = require("../app/teams")

const playersRoutes = require("../app/player")

const refreeRoutes = require("../app/refree")

const staduimsRoutes = require("../app/staduims")

const gamesRoutes = require("../app/games")

const notifcationsRoutes = require("../app/notifcations")

const LeaguesRoutes = require("../app/leagues")

const usersRoutes = require("../app/users")

const express = require("express");

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/comments", commentsRoutes);

router.use("/notifcations", notifcationsRoutes);

router.use("/challanges", challangesRoutes);

router.use("/teams", teamsRoutes);

router.use("/players", playersRoutes);

router.use("/refree", refreeRoutes);

router.use("/staduims", staduimsRoutes);

router.use("/games", gamesRoutes);

router.use("/leagues", LeaguesRoutes);

router.use("/users", usersRoutes);

module.exports = router;


