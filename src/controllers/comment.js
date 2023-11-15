

const Feeds = require("../models/feeds");

const Comments = require("../models/comments");

const AppError = require("./errorController");


var controller = {}


controller.postComment = async (req, res) => {

    try {
        const { id, comment, restaurant_id, video_id } = req.body;

        let video_exists = await Feeds.findOne({ _id: id });

        let comments = Comments({
            comment: comment,
            published_by: restaurant_id,
            video_id: video_id,
        })

        await comments.save();

        if (video_exists) {
            await Feeds.updateOne({ _id: video_id }, {
                "$push": {
                    "comments": comments
                }
            })
        } else {
            res.status(200).json({
                success: false,
                msg: "video with this id does not exists"
            });
        }
    } catch (error) {
        res.status(200).json({
            success: false,

        });
    }
}


controller.getComments = async (req, res) => {

    const { feed_id } = req.body.feed_id;

    try {
        const comments = await Feeds.findOne({ _id: feed_id }).populate("comments");

        return res.status(200).json({
            "success": true,
            "comments": comments.comments,
        });

    } catch (error) {
        return res.status(500).json({
            "success": false,
            "error": error,
        });
    }
}


controller.replyComments = async (req, res) => {

    const { comment_id, comment, } = req.body;
   
    try {

        
        let comments = Comments({
            comment: comment,
            published_by: restaurant_id,
            video_id: video_id,
        })


        await comments.save();

        return res.status(200).json({
            "success": true,
            "msg": "ok",

        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error,
        });
    }
}

module.exports = controller;