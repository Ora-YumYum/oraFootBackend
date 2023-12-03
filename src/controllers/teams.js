




const Teams = require("../models/users/Teams")

const Users = require("../models/users/users")

const {ObjectId} = require('mongodb'); // or ObjectID 


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
    console.log(id);
    if (id != undefined && id != "") {
        try {
            let user = await Users.findOne({ _id: id }).populate("invitations");
            console.log(user)
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
    console.log(id);
    if (id != undefined && id != "") {
        try {
            let team = await Teams.findOne({ _id: new ObjectId(id) }).populate("players");
            console.log(team)
            return res.status(200).send({
                success: true, message: "ok",
                players: team.players,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Server Error", results: null });
        }
    } else {
        res.status(400).send({ success: false, message: "please enter an id " });
    }
}

module.exports = controller;