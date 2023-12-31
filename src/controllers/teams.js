




const Teams = require("../models/users/Teams");
const Players = require("../models/users/players");

const Challanges = require("../models/challanges");

const Users = require("../models/users/users")

const Invitation = require("../models/invitation");

const Notifications = require("../models/notifications");

const { ObjectId } = require('mongodb');


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


controller.viewAllTeams = async (req, res,) => {
    const id = req.userId;
    try {
        let players = await Users.find({ user_type: 0 }).populate("team")
        res.status(200).json({
            "success": true,
            "teams": teams
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.getPlayersInvitations = async (req, res) => {
    const id = req.userId;

    if (id != undefined && id != "") {
        try {
            let user = await Users.findOne({ _id: id }).populate({
                path: "invitations",
                populate: {
                    "path": "user_id",
                },
                match: {
                    "type": "player_invitation",
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


controller.getChallengesInvitations = async (req, res) => {
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

        let opponent_team_Exits = await Teams.findOne({ _id: new ObjectId(opponent_team_id) });

        let teamExits = await Users.findOne({ _id: new ObjectId(team_id) });

        if (opponent_team_Exits) {

            let invitation = Invitation({
                type: "team_invitation",
                user_id: team_id,
                data: {
                    "opponent_team_id": opponent_team_Exits._id,
                    "team_name": team_name,
                    "team_id": team_id,
                    "challange_id": challange_id,
                },
                status: 2,
            });

            let notification = Notifications({
                type: "invite_team",
                invitation: invitation,
                user_id: opponent_team_id,
                title: team_name,
                img: teamExits.profile_img,
            });
            await notification.save();

            await invitation.save();

            await Users.updateMany({ _id: { $in: [team_id.toString(), opponent_team_Exits.user_id.toString()] } }, {
                "$push": {
                    "invitations": invitation
                }
            },),
                await Users.updateOne({ _id: opponent_team_Exits.user_id }, {
                    "$push": {
                        "notifications": notification
                    },
                },),
                await Challanges.updateOne({ _id: challange_id }, {
                    $set: {
                        "invitation": invitation,
                    }
                });

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



controller.sendRequestToChallenge = async (req, res) => {

    const { opponent_team_id, team_id,challange_id } = req.body;
    try {

        let opponent_team_Exits = await Teams.findOne({ _id: new ObjectId(opponent_team_id) });

        let teamExits = await Users.findOne({ _id: new ObjectId(team_id) });

        if (opponent_team_Exits) {

            let invitation = Invitation({
                type: "challenge_request",
                user_id: opponent_team_Exits.user_id,
                data: {
                    "opponent_team_id": team_id,
                    "team_name": opponent_team_Exits.team_name,
                    "team_id": opponent_team_Exits.user_id,
                    "challange_id": challange_id,
                },
                status: 2,
            });

            let notification = Notifications({
                type: "challenge_request",
                invitation: invitation,
                user_id: opponent_team_id,
                title: opponent_team_Exits.team_name,
                img: opponent_team_Exits.profile_img,
            });
            await notification.save();

            await invitation.save();

            await Users.updateMany({ _id: { $in: [team_id.toString(), opponent_team_Exits.user_id.toString()] } }, {
                "$push": {
                    "invitations": invitation
                }
            },),

                await Users.updateOne({ _id: team_id }, {
                    "$push": {
                        "notifications": notification
                    },
                },),
                await Challanges.updateOne({ _id: challange_id }, {
                    $set: {
                        "invitation": invitation,
                    }
                });

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


controller.accepteRequestToChallenge = async (req, res) => {

    const { opponent_team_id, team_id, team_name, challange_id,
        invitation_id, notification_id } = req.body;

    try {

        let team_Exits = await Users.findOne({ "_id":  team_id });

        let opponent_team_Exits = await Users.findOne({ "_id": opponent_team_id}).populate("team");


        if (team_Exits && opponent_team_Exits) {

            let notification = Notifications({
                type: "accepte_challenge_request",
                user_id: team_id,
                title: opponent_team_Exits.team.team_name,
                invitation: invitation_id,
                img: opponent_team_Exits.team.profile_img,
            });

            await notification.save();

            await Invitation.updateOne({ _id: invitation_id }, {
                "$set": {
                    status: 0,
                }
            });

            await Users.updateOne({
                _id: team_id
            }, {
                "$push": {
                    "challanges": challange_id
                },
            },);

            await Users.updateOne({ _id: team_id }, {
                "$push": {
                    "notifications": notification,
                },
            },);
            console.log("im her");
            await Challanges.updateOne({ _id: challange_id }, {
                "$set": {
                    "opponent_team": team_Exits.team,
                    "opponent_team_id":team_Exits._id ,
                },
            },);

            if (notification_id != null || notification_id != undefined) {
                let update_notifications = await Notifications.updateOne({ _id: notification_id }, {
                    "$set": {
                        read: true,
                    }
                });
            };

            res.status(200).json({
                "success": true,
                "msg": "Challenge accepted Successfully",
            });
        } else {
            res.status(200).json({
                "success": false,
                "msg": "invalid team",
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

    const { opponent_team_id, team_id, team_name, challange_id,
        invitation_id, notification_id } = req.body;

    try {

        let team_Exits = await Users.findOne({ "_id": team_id });

        let opponent_team_Exits = await Teams.findOne({ "_id": opponent_team_id });


        if (team_Exits && opponent_team_Exits) {

            let notification = Notifications({
                type: "accepted_invitation",
                user_id: opponent_team_Exits.user_id,
                title: team_name,
                invitation: invitation_id,
                img: opponent_team_Exits.profile_img,
            });

            await notification.save();

            await Invitation.updateOne({ _id: invitation_id }, {
                "$set": {
                    status: 0,
                }
            });

            await Users.updateOne({
                _id: opponent_team_Exits
                    .user_id
            }, {
                "$push": {
                    "challanges": challange_id
                },
            },);

            await Users.updateOne({ _id: team_id }, {
                "$push": {
                    "notifications": notification,
                },
            },);
            console.log("im her");
            await Challanges.updateOne({ _id: challange_id }, {
                "$set": {
                    "opponent_team": opponent_team_id,
                    "opponent_team_id": opponent_team_Exits.user_id,
                },
            },);

            if (notification_id != null || notification_id != undefined) {
                let update_notifications = await Notifications.updateOne({ _id: notification_id }, {
                    "$set": {
                        read: true,
                    }
                });
            };

            res.status(200).json({
                "success": true,
                "msg": "Challenge accepted Successfully",
            });
        } else {
            res.status(200).json({
                "success": false,
                "msg": "invalid team",
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



controller.accepteLeagueInvitation = async (req, res) => {

    const { team_user_id, postedBy, invitation_id, } = req.body;

    try {

        let teamExits = await Users.findOne({ _id: team_user_id }).populate("team");


        let notification = Notifications({
            type: "team_accepted_league_invitation",
            user_id: team_user_id,
            title: teamExits.team.team_name,
            img: teamExits.team.profile_img ?? "",
            invitation: invitation_id
        });

        await notification.save();

        await Invitation.updateOne({
            _id: invitation_id,
            "data.team_id": new ObjectId(teamExits.team._id)
        }, {
            "$set": {
                "data.$.status": 0
            },
        },);

        await Users.updateOne({ _id: postedBy, }, {
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