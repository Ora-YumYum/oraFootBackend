



const gamesController = require("../../controllers/games")

const express = require("express");
const router = express.Router();

router.get("/", gamesController.viewGames);

module.exports = router;