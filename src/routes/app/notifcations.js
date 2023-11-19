const notifcations_controller = require("../../controllers/notifcations.js")
const express = require("express")
const { body, validationResult } = require('express-validator');
let router = express.Router();

const middleware = require("../../middlewares/userAuth.js")

const app = express();


app.use(express.json());


router.post("/read_notifcations", middleware,notifcations_controller.readNotifcations)

router.get("/get_notifcations", middleware,notifcations_controller.getNotifcations);

module.exports = router;