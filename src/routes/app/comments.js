


const commentsController = require("../../controllers/comment")

const express = require("express");
const router = express.Router();

router.post("/comment", commentsController.postComment);

router.post("/reply_comment", commentsController.replyComments);


router.post("/get_comments", commentsController.getComments);

module.exports = router;
