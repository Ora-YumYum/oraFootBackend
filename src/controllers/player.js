


const Players = require("../models/users/players")

const Users = require("../models/users/users")

const Invitation = require("../models/invitation");

const Notifications = require("../models/notifications");

const Teams = require("../models/users/Teams");

const { ObjectId } = require('mongodb');

var controller = {};

controller.SearchForPlayers = async (req, res) => {

    const query = req.query.query;

    if (query != "") {
        try {
            let response = await Users.aggregate([
                {
                    '$search': {
                        "index": "default",
                        'compound': {
                            'should': [
                                {
                                    'autocomplete': {
                                        'query': query,
                                        'path': 'first_name'
                                    }
                                },
                                {
                                    'autocomplete': {
                                        'query': query,
                                        'path': 'last_name'
                                    }
                                }
                            ],
                            'minimumShouldMatch': 1
                        }
                    }
                },

                { $limit: 10, },
                {
                    $match: {
                        "user_type": {
                            $eq: 5,
                        }
                    }
                }
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
    } else {
        return res.status(400).send({
            "results": null,
            "success": false,
            "message": "invalid query"
        })
    }


}

controller.viewAllPlayers = async (req, res,) => {
    try {
        let players = await Users.find({ user_type: 5 }).populate("player")
        res.status(200).json({
            "success": true,
            "players": players
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.getTeamPlayers = async (req, res,) => {
    const id = req.userId;
    try {

        let players = await Teams.findOne({ _id: id }).populate("players");

        res.status(200).json({
            "success": true,
            "players": players
        });

    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.sendInvitation = async (req, res) => {

    const { player_id, team_id, team_name, position } = req.body;
    try {

        let playerExits = await Users.findOne({ _id: player_id });

        let teamExits = await Users.findOne({ _id: team_id });

        if (playerExits) {

            let invitation = Invitation({
                type: "player_invitation",
                user_id: team_id,
                data: {
                    "team_id": team_id,
                    "player_id": player_id,
                    "team_name": team_name,
                },
                status: 2,
            });

            let notification = Notifications({
                type: "invite_team",
                invitation: invitation,
                user_id: player_id,
                title: team_name,
                img: teamExits.profile_img
            });
            await notification.save();

            await invitation.save();

            await Users.updateMany({ _id: { $in: [team_id.toString(), player_id.toString()] } }, {
                "$push": {
                    "invitations": invitation
                }
            },),
                await Users.updateOne({ _id: player_id }, {
                    "$push": {
                        "notifications": notification
                    },
                },),
                await Teams.updateOne({ _id: teamExits.team }, {
                    "$push": {
                        "players": {
                            "player": playerExits.player,
                            "status": 2,
                            "position": position,
                        }
                    },
                },),
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


controller.viewAllInvitations = async (req, res,) => {

    const id = req.userId;
    try {
        let player = await Users.findOne({ _id: id }).populate({
            path : "invitations",
            populate : {
                path : "user_id",
                select : "profile_img team ",
            },
            match : {
                type : "player_invitation",
                status : 2,
            }
        }).select("invitations")
        res.status(200).json({
            "success": true,
            "invites": player.invitations
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};

controller.accepteInvitation = async (req, res) => {

    const { team_id, team_user_id, player_name, invitation_id, player_id, player_user_id } = req.body;

    try {

        let playerExits = await Users.findOne({ _id: player_user_id });

        console.log(invitation_id)

        let notification = Notifications({
            type: "player_accepted_invitation",
            user_id: team_user_id,
            title: player_name,
            img: playerExits.profile_img,
            invitation: invitation_id
        });

        let invitation = await Invitation.updateOne({ _id: invitation_id }, {
            "$set": {
                status: 0,
            }
        })
        await Users.updateOne({ _id: team_user_id, }, {
            "$push": {
                "notifications": notification
            },
        },)


        await Teams.updateOne({ _id: team_id, "players.player": new ObjectId(player_id) }, {
            "$set": {
                "players.$.status": 0
            },
        },);

        res.status(200).json({
            "success": true,
            "msg": "invitation was accepted successfully",
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