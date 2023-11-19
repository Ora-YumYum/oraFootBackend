



const authController = require("../../controllers/auth")


const express = require("express");
const router = express.Router();

router.post("/login", authController.onLogin);

router.post("/signup", authController.onSignup);

router.post("/find_account", authController.findAccount);

router.post("/reset_password", authController.resetPassowrd);

router.get("/profile", authController.getProfile);


module.exports = router;
