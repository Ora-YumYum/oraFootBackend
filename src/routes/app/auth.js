



const authController = require("../../controllers/auth")

const middleware = require("../../middlewares/userAuth")

const express = require("express");
const router = express.Router();

router.post("/login", authController.onLogin);

router.post("/signup", authController.onSignup);

router.post("/find_account", authController.findAccount);

router.post("/reset_password", authController.resetPassowrd);

router.post("/update_password", middleware, authController.updatePassowrd);

router.post("/update_token", authController.updateToken);

router.post("/profile", middleware ,authController.getProfile);

router.post("/update_profile", middleware ,authController.updateProfile);


module.exports = router;
