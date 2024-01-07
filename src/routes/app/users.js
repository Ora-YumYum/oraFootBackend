





const followersController = require("../../controllers/followers")

const express = require("express");
const router = express.Router();

const middleware = require("../../middlewares/userAuth")

const { body, check, validationResult } = require('express-validator');


router.post("/follow", middleware, followersController.follow);

router.post("/get_followers", middleware, followersController.getFollowers);

router.post("/get_profile", middleware, followersController.getProfile);


////viewMyGames

module.exports = router;