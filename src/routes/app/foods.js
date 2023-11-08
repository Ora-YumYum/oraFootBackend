
const foodController = require("../../controllers/foodController")

const express = require("express");
const router = express.Router();



router.post("/add_product", foodController.addFood);

router.post("/signup", authController.onSignup);


module.exports = router;