




const challangesController = require("../../controllers/challanges")

const express = require("express");
const router = express.Router();


router.post("/add_challange", challangesController.createChallange);

router.post("/", challangesController.viewAllChallanges);

router.delete("delete_challange", challangesController.deleteChallanges);



module.exports = router;