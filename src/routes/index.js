
const appRoutes = require("./app/index")

const express = require("express");
const router = express.Router();

router.use("/app", appRoutes);




module.exports = router;
