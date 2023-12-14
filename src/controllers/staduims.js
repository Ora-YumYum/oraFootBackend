



const Challanges = require("../models/challanges");
const AppError = require("./errorController");
const Staduims = require("../models/users/staduims");
const Notifications = require("../models/notifications");
const Invitation = require("../models/invitation");

var controller = {}

controller.getStaduims = async (req, res,) => {

    let wilaya = Number.parseInt(req.body.wilaya);

    if (wilaya != undefined || wilaya != "" || wilaya != null) {

        try {
            let staduims = await Staduims.find({ wilaya: wilaya })
            res.status(200).json({
                "success": true,
                "staduims": staduims
            });
        } catch (error) {

            return AppError.onError(error, "restaurant add error" + error);
        }
    }
};


controller.viewAllStaduims = async (req, res,) => {
    try {
        let staduims = await Staduims.find()
        res.status(200).json({
            "success": true,
            "message": "ok",
            "staduims": staduims
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.deleteStaduim = async (req, res) => {
    const id = req.body._id;
    try {
        await Staduims.deleteOne({ _id: id })
        res.status(200).json({
            "success": true,
            "message": "type was deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({});
    }
};

controller.accepteInvitation = async (req, res) => {

    const { challenge_id, staduim_user_id, staduim_name, invitation_id, } = req.body;

    try {

        let staduimExits = await Users.findOne({ _id: staduim_user_id });

        let challengeExits = await Users.findOne({ _id: challenge_id });

        let notification = Notifications({
            type: "staduim_accepted_invitation",
            user_id: staduim_user_id,
            title: staduim_name,
            img: staduimExits.profile_img ??"",
            invitation: invitation_id
        });

        await notification.save();

        await Invitation.updateOne({ _id: invitation_id }, {

            "$set": {
                "status": 0,
            }
        });

        await Challenges.updateOne({ _id: challenge_id }, {
            "$set": {
            "staduim": staduim_user_id,
            },
        });

        await Users.updateOne({ _id: challengeExits.postedBy, }, {
            "$push": {
                "notifications": notification
            },
        },)

        return res.status(200).json({
            "success": true,
            "msg": "Invitation was accepted successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "msg": error,
        });
    }
}


module.exports = controller;