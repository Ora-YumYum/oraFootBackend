




const Teams = require("../models/users/Teams");
const Players = require("../models/users/players");

const Challanges = require("../models/challanges");

const Users = require("../models/users/users")

const Invitation = require("../models/invitation");

const Notifications = require("../models/notifications");

const { ObjectId } = require('mongodb'); // or ObjectID 


var controller = {};

controller.SearchForTeams = async (req, res) => {

    const query = req.query.query;

    try {
        let response = await Teams.aggregate([
            {
                "$search": {
                    "index": "default",
                    "autocomplete": {
                        "query": query,
                        "path": "team_name",
                        "fuzzy": {
                            "maxEdits": 1,
                            "prefixLength": 3,
                        },
                    },
                },
            },

            { $limit: 10, },
        ]);
        return res.status(200).send({
            "results": response,
            "success": true,
            "message": "ok"
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            "results": null,
            "success": false,
            "message": "ok"
        })
    }
}

controller.getInvitations = async (req, res) => {
    const id = req.userId;

    let ids = [];
    let playersList = [];

    if (id != undefined && id != "") {
        try {
            let user = await Users.findOne({ _id: id }).populate({
                path: "invitations",
                populate: {
                    "path": "opponent_team_id",
                    "select": "team",
                    "populate": {
                        path: "team"
                    }
                },
                match: {
                    "type": "team_invitation",
                    "status": 2,
                }
            },);
            return res.status(200).send({
                success: true, message: "ok", results: {
                    invitations: user.invitations,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Server Error", results: null });
        }
    } else {
        res.status(400).send({ success: false, message: "please enter an id " });
    }
}

controller.getPlayers = async (req, res) => {
    const id = req.query.id;
    let ids = [];
    console.log(id);
    let playersList = [];
    if (id != undefined && id != "") {
        try {
            let team = await Teams.findOne({ _id: new ObjectId(id) }).populate("players");
            team.players.forEach(element => {
                ids.push(element.player);
            });

            const players = await Players.find({ _id: ids }).populate("user_id");


            for (let index = 0; index < team.players.length; index++) {
                const element = team.players[index];
                let id = team.players[index]["player"];

                element["player_info"] = players.
                    filter(el => el["user_id"]["player"].toString() == id.toString());

                playersList.push(element);
            }

            return res.status(200).send({
                success: true, message: "ok",
                players: playersList,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Server Error", results: null });
        }
    } else {
        res.status(400).send({ success: false, message: "please enter an id " });
    }
}



controller.sendInvitation = async (req, res) => {

    const { opponent_team_id, team_id, team_name, challange_id } = req.body;
    try {

        let opponent_team_Exits = await Users.findOne({ _id: opponent_team_id });

        let teamExits = await Users.findOne({ _id: team_id });

        if (opponent_team_Exits) {

            let invitation = Invitation({
                type: "team_invitation",
                user_id: opponent_team_id,
                data: {
                    "team_id": team_id,
                    "opponent_team_id": opponent_team_id,
                    "team_name": team_name,
                    "challange_id": challange_id,
                },
                status: 2,
            });

            let notification = Notifications({
                type: "invite_team",
                invitation: invitation,
                user_id: opponent_team_id,
                title: team_name,
            });
            await notification.save();

            await invitation.save();

            await Users.updateMany({ _id: { $in: [team_id.toString(), opponent_team_id.toString()] } }, {
                "$push": {
                    "invitations": invitation
                }
            },),
                await Users.updateOne({ _id: opponent_team_id }, {
                    "$push": {
                        "notifications": notification
                    },
                },),
                await Challanges.updateOne({ _id: challange_id }, {
                    $set: {
                        "invitation": invitation,
                        "opponent_team": opponent_team_id,
                    }
                })
            res.status(200).json({
                "success": true,
                "msg": "invitation was sent successfully",
            });
        } else {
            res.status(400).json({
                "success": false,
                "msg": "Invalid id",
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "msg": error,
        });
    }
}


controller.accepteInvitation = async (req, res) => {

    const { opponent_team_id, team_id, team_name, challange_id, invitation_id, notification_id } = req.body;

    try {

        let notification = Notifications({
            type: "accepted_invitation",
            user_id: team_id,
            title: team_name,
            invitation: invitation_id,
        });

        await notification.save();

        let invitation = await Invitation.updateOne({ _id: invitation_id }, {
            "$set": {
                status: 0,
            }
        })

        await Users.updateOne({ _id: opponent_team_id }, {
            "$push": {
                "notifications": notification
            },
        },);

        await Users.updateOne({ _id: team_id }, {
            "$push": {
                "challanges": challange_id
            },
        },);

        await Challanges.updateOne({ _id: challange_id }, {
            "$set": {
                "status": 0
            },
        },);


        if (notification_id != null) {
            let update_notifications = await Notifications.updateOne({ _id: notification_id }, {
                "$set": {
                    read: true,
                }
            })
        }
        res.status(200).json({
            "success": true,
            "msg": "Challenge accepted successfully",
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