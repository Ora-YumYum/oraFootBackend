 
const playerController = require("../../controllers/player")

const express = require("express");
const router = express.Router();

const middleware = require("../../middlewares/userAuth")

const { body, check, validationResult } = require('express-validator');


router.get("/search_players", playerController.SearchForPlayers);

router.get("/get_players", playerController.viewAllPlayers);

router.post("/send_invitation", playerController.sendInvitation);


module.exports = router;