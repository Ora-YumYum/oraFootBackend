



const Games = require("../models/games");
const Players = require("../models/users/players");
const Users = require("../models/users/users");
const Notifications = require("../models/notifications");
const Invitation = require("../models/invitation");

const Challenges = require("../models/challanges");


const controller = {}



controller.updateGoals = async (req, res) => {

    const { id, player_id, date } = req.body;

    try {
        await Games.updateOne({ _id: id }, {
            "$push": {
                "goals": {
                    "player": player_id,
                    'date': date,
                }
            }
        });
        await Players.updateOne({
            "$push": {
                "goals": {
                    "game": id,
                    'date': date,
                }
            }
        });
        res.status(200).json({
            success: true,
            "message": "type was updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).jsons({
            "success": false,
            "message": "something happpend please try again later",
        });
    }
}


controller.updateFouls = async (req, res) => {

    const { id, player_id, date } = req.body;

    try {
        await Games.updateOne({ _id: id }, {
            "$push": {
                "fouls": {
                    "player": player_id,
                    'date': date
                }
            }
        });
        res.status(200).json({
            success: true,
            "message": "type was updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).jsons({
            "success": false,
            "message": "something happpend please try again later",
        });
    }
}


controller.updateCards = async (req, res) => {

    const { id, player_id, date, card } = req.body;

    try {
        await Games.updateOne({ _id: id }, {
            "$push": {
                "cards": {
                    "player": player_id,
                    "date": date,
                    "card": card,
                }
            }
        });
        res.status(200).json({
            success: true,
            "message": "type was updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).jsons({
            "success": false,
            "message": "something happpend please try again later",
        });
    }
}


controller.uploadPhotos = async (req, res) => {

    const { id, player_id, date, card } = req.body;

    try {
        await Games.updateOne({ _id: id }, {
            "$push": {
                "cards": {
                    "player": player_id,
                    "date": date,
                    "card": card,
                }
            }
        });
        res.status(200).json({
            success: true,
            "message": "type was updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).jsons({
            "success": false,
            "message": "something happpend please try again later",
        });
    }
}


controller.getMyChallenges = async (req, res) => {
    const id = req.userID;
    if (id != undefined && id != "" || id != null) {
        try {

            const challenges = await Users.findOne({ _id: id }).populate({ path: "challanges" });

            if (!challenges) {
                res.status(200).send({
                    "success": true, "message": "ok", results: {
                        "challenges": challenges,
                    },
                });
            } else {
                res.status(200).send({
                    "success": false, "message": "Invalid id", results: {
                        "challenges": null,
                    },
                });
            }

        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Server Error", results: null });
        }
    } else {
        res.status(400).send({ success: false, message: "please enter an id " });
    }
}


controller.accepteInvitation = async (req, res) => {

    const { challenge_id, refree_user_id, refree_name, invitation_id, } = req.body;

    try {

        let refreeExits = await Users.findOne({ _id: refree_user_id });

        let challengeExits = await Users.findOne({ _id: challenge_id });

        let notification = Notifications({
            type: "refree_accepted_invitation",
            user_id: refree_user_id,
            title: refree_name,
            img: refreeExits.profile_img,
            invitation: invitation_id
        });

        await notification.save();

        await Invitation.updateOne({ _id: invitation_id }, {
            "$set": {
                status: 0,
            }
        })

        await Challenges.updateOne({ _id: challenge_id }, {
            "$set": {
                refree: refree_user_id,
            }
        })

        await Users.updateOne({ _id: challengeExits.team, }, {
            "$push": {
                "notifications": notification
            },
        },);

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



