 
const TeamsController = require("../../controllers/teams")

const express = require("express");
const router = express.Router();

const middleware = require("../../middlewares/userAuth")

const { body, check, validationResult } = require('express-validator');


router.get("/search_teams", TeamsController.SearchForTeams);

router.get("/get_invitation",middleware, TeamsController.getInvitations);

router.get("/get_players", TeamsController.getPlayers);

module.exports = router;