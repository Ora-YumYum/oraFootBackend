
const authRoutes = require("../app/auth")

const commentsRoutes = require("../app/comments")

const express = require("express");
const router = express.Router();

router.use("/auth", authRoutes);

router.use("/comments", commentsRoutes);



module.exports = router;


