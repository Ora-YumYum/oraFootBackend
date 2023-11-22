


const Players = require("../models/users/players")

const Users = require("../models/users/users")

const Invitation = require("../models/invitation");

const Notifications = require("../models/notifications");

const Teams = require("../models/users/Teams");


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
        let players = await Players.find()
        res.status(200).json({
            "success": true,
            "players": players
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.sendInvitation = async (req, res) => {

    const { player_id, team_id , team_name } = req.body;
    try {
        let playerExits = await Players.findOne({ _id: player_id });

        if (playerExits) {

            let invitation = Invitation({
                type: "team_invitation",
                user_id: player_id,
                data: {
                    "team_id": team_id,
                    "player_id": player_id,
                },
                status: 2,
            });

            let notification = Notifications({
                type: "invite_team",
                invitation: invitation,
                user_id: player_id,
                title : team_name,
            });

            await Users.updateMany({ _id: { $in: [team_id, player_id] } }, {
                "$push": {
                    "invitations": invitation
                }
            },),

                await Users.updateOne({ _id: player_id }, {
                    "$push": {
                        "notifications": notification
                    },
                },)
        }

        res.status(200).json({
            "success": true,
            "msg": "invitation was sent successfully",
        });

    } catch (error) {
        res.status(500).json({
            "success": false,
            "msg": error,
        });
    }
}

controller.accepteInvitation = async (req, res) => {

    const { team_id, player_name, invitation_id } = req.body;

    try {

        let notification = Notifications({
            type: "accepted_invitation",
            user_id: team_id,
            title: player_name,
        });

        let invitation = await Invitation.updateOne({ _id: invitation_id }, {
            "$set" : {
                status: 0,
            }
        })

        await Users.updateOne({ _id: team_id }, {
            "$push": {
                "notifications": notification
            },
        },)

    } catch (error) {

    }
}

module.exports = controller;