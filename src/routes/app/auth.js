



const authController = require("../../controllers/userController")


const express = require("express");
const router = express.Router();

router.post("/login", authController.onLogin);

router.post("/signup", authController.onSignup);



module.exports = router;
