



const leaguesController = require("../../controllers/leagues")



const express = require("express");
const router = express.Router();

const middleware = require("../../middlewares/userAuth")

const { body, check, validationResult } = require('express-validator');


router.post("/create_league", middleware, leaguesController.createLeague);

router.get("/", middleware, leaguesController.viewAllLeagues);

router.get("/my_leagues", middleware, leaguesController.viewMyLeagues);

router.get("/get_by_id", middleware, leaguesController.getLeagueById);

router.post("/accepte_invitation", middleware, leaguesController.accepteLeagueInvitation);

router.post("/send_gamesTo_staduims", middleware, leaguesController.iviteStaduims);

router.post("/accepte_league_staduimInv", middleware, leaguesController.accepteLeagueInvitationStaduim);




////viewMyGames

module.exports = router;