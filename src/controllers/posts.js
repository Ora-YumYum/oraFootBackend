

const Posts = require("../models/posts");

const Comments = require("../models/comments");

const Users = require("../models/users");


var controller = {}


controller.postNewPost = async (req, res) => {

    try {
        const { user_id, desc, } = req.body;

        let user_exists = await Users.findOne({ _id: user_id });

        let post = Posts({
            desc: desc,
            user: user_id,
        })

        await post.save();

        if (user_exists) {
            await Users.updateOne({ _id: user_id }, {
                "$push": {
                    "posts": post
                }
            });
            res.status(200).json({
                success: true,
                msg: "post posted successfully"
            });
        } else {
            res.status(200).json({
                success: false,
                msg: "user with this id does not exists"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "something happend please try again later"
        });
    }
}


controller.getComments = async (req, res) => {

    const { feed_id } = req.body.feed_id;

    try {
        const comments = await Feeds.findOne({ _id: feed_id }).populate("comments");

        return res.status(200).json({
            success: true,
            comments: comments.comments,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error,
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
            success: true,
            msg: "",

        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error,
        });
    }
}

module.exports = controller;