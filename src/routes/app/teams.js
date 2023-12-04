 
const TeamsController = require("../../controllers/teams")

const express = require("express");
const router = express.Router();

const middleware = require("../../middlewares/userAuth")

const { body, check, validationResult } = require('express-validator');


router.get("/search_teams", TeamsController.SearchForTeams);

router.get("/get_invitation",middleware, TeamsController.getInvitations);

router.get("/get_players", middleware, TeamsController.getPlayers);

router.post("/send_invitation",middleware, TeamsController.sendInvitation);

router.post("/accepte_invitation",middleware, TeamsController.accepteInvitation);


module.exports = router;