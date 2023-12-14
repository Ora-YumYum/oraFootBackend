



const gamesController = require("../../controllers/games")

const express = require("express");
const router = express.Router();

router.get("/", gamesController.getGames);

module.exports = router;