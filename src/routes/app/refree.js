
const refreeController = require("../../controllers/refree")

const express = require("express");
const router = express.Router();

const middleware = require("../../middlewares/userAuth")

const { body, check, validationResult } = require('express-validator');


router.post("/accepte_invitation", refreeController.accepteInvitation);

router.post("/update_goals", refreeController.updateGoals);

router.post("/update_fouls", refreeController.updateFouls);

router.post("/update_cards", middleware, refreeController.updateCards);

router.get("/my_games", middleware, refreeController.viewMyGames);

////viewMyGames

module.exports = router;