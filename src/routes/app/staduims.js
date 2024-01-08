



const staduimController = require("../../controllers/staduims")

const express = require("express");
const router = express.Router();

const middleware = require("../../middlewares/userAuth")

const { body, check, validationResult } = require('express-validator');


router.post("/accepte_invitation", staduimController.accepteInvitation);

router.post("/accepte_league_invitation", staduimController.accepteInvitation);

router.get("/get_staduims", staduimController.getStaduims);

router.get("/rent_requests", middleware, staduimController.getRentRequests);

router.post("/rent", staduimController.rent_staduim);

router.post("/validate_rent_request", staduimController.validateRentRequest);


////viewMyGames

module.exports = router;