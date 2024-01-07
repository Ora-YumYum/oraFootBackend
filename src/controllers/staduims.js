



const Challenges = require("../models/challanges");
const AppError = require("./errorController");
const Staduims = require("../models/users/staduims");
const Notifications = require("../models/notifications");
const Invitation = require("../models/invitation");

const Rents = require("../models/rents");

const Users = require("../models/users/users");
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

        let challengeExits = await Challenges.findOne({ _id: challenge_id });

        let notification = Notifications({
            type: "staduim_accepted_invitation",
            user_id: staduim_user_id,
            title: staduim_name,
            img: staduimExits.profile_img ?? "",
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
                "staduim": staduimExits.staduim,
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



controller.accepteLeagueInvitation = async (req, res) => {

    const { staduim_user_id, team_id, invitation_id, } = req.body;

    try {

        let staduimExits = await Users.findOne({ _id: staduim_user_id }).populate("staduim");

        let notification = Notifications({
            type: "staduim_accepted_league_invitation",
            user_id: staduim_user_id,
            title: staduimExits.staduim.staduim_name,
            img: staduimExits.staduim.cover_img ?? "",
            invitation: invitation_id
        });

        await notification.save();

        await Invitation.updateOne({
            _id: invitation_id,
            "data.staduim_id": new ObjectId(staduimExits.staduim._id)
        }, {
            "$set": {
                "data.$.status": 0
            },
        },);

        await Users.updateOne({ _id: team_id, }, {
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


controller.rent_staduim = async (req, res,) => {

    const id = req.userId;
    const { user_id, rent_date, staduim_id } = req.body;


    try {
        console.log(staduim_id)
        let staduimExits = await Users.findOne({ _id: staduim_id }).populate("staduim");


        let notification = Notifications({
            type: "request_rent_staduim",
            user_id: user_id,
            title: "",
            img: "",
        });


        let rent = Rents({
            user_id: user_id,
            rent_date: rent_date,
            staduim_id: staduimExits.staduim._id,
        });
        await Staduims.updateOne({
            _id: staduimExits.staduim._id,
        }, {
            "$push": {
                "rents": rent,
                "notifications": notification,
            },
        });


        await notification.save();

        await rent.save();

        return res.status(200).send({
            "success": true,
            "message": "rent saved successfully",
            "rent": rent,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            "success": false,
            "message": error
        });
    }
};



controller.getRentRequests = async (req, res,) => {

    let id = req.userId;

    console.log(id);

    if (id != undefined || id != "" || id != null) {

        try {

            let rent_requests = await Users.findOne({ _id: id }).populate({
                "path": "staduim",
                "select": "staduim",
                "select": "rents",
                "populate": {
                    "path": "rents"
                }
            }).select("staduim _id")


            res.status(200).json({
                "success": true,
                "message": "ok",
                "requests": rent_requests,
            });

        } catch (error) {
            return AppError.onError(error, "hade some error" + error);
        }
    } else {
        res.status(404).json({
            "success": false,
            "message": "invalid id ",
        });
    }
};


controller.accepteRentRequest = async (req, res) => {

    const { staduim_user_id, reservation_id, user_id } = req.body;

    try {

        console.log(staduim_user_id)

        let staduimExits = await Users.findOne({ _id: staduim_user_id }).populate("staduim");

        let notification = Notifications({
            type: "staduim_accepted_rent_request",
            user_id: staduim_user_id,
            title: staduimExits.staduim.staduim_name,
            img: staduimExits.staduim.cover_img ?? "",
        });

        await notification.save();

        await Rents.updateOne({
            _id: reservation_id,
        }, {
            "$set": {
                "status": 0
            },
        },);

        await Users.updateOne({ _id: user_id, }, {
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