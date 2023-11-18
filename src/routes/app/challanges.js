




const challangesController = require("../../controllers/challanges")

const express = require("express");
const router = express.Router();

const middleware = require("../../middlewares/userAuth")

const { body, check, validationResult } = require('express-validator');

router.post("/add_challange", [
    body("title").notEmpty(),
    body("location").notEmpty(),
    body("price").notEmpty(),
]
    , (req, res, next) => {
        const error = validationResult(req).formatWith(({ msg }) => msg);

        const hasError = !error.isEmpty();

        if (hasError) {
            res.status(422).json({ success: false, message: "Please check all the fields", results: null },);
        } else {
            next();
        }

    }, middleware , challangesController.createChallange);

router.get("/", challangesController.viewAllChallanges);

router.get("/get_staduims", challangesController.getStaduims);

router.delete("delete_challange", challangesController.deleteChallanges);



module.exports = router;