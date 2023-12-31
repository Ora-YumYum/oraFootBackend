



const gamesController = require("../../controllers/games")

const express = require("express");
const router = express.Router();

router.get("/", gamesController.viewGames);

router.get("/active_games", gamesController.activeGames);


module.exports = router;