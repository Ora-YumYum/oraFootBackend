



const leaguesController = require("../../controllers/leagues")



const express = require("express");
const router = express.Router();

const middleware = require("../../middlewares/userAuth")

const { body, check, validationResult } = require('express-validator');


router.post("/create_league", middleware, leaguesController.createLeague);

router.post("/accepte_invitation", middleware, leaguesController.accepteLeagueInvitation);


////viewMyGames

module.exports = router;