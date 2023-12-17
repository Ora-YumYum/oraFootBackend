



const staduimController = require("../../controllers/staduims")

const express = require("express");
const router = express.Router();

const middleware = require("../../middlewares/userAuth")

const { body, check, validationResult } = require('express-validator');


router.post("/accepte_invitation", staduimController.accepteInvitation);

router.post("/accepte_league_invitation", staduimController.accepteInvitation);

router.get("/get_staduims", staduimController.getStaduims);


////viewMyGames

module.exports = router;