




const Teams = require("../models/users/Teams");
const Players = require("../models/users/players");

const Users = require("../models/users/users")

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
    let ids = []
    console.log(id);
    if (id != undefined && id != "") {
        try {
            let user = await Users.findOne({ _id: id }).populate("invitations");

            user.invitations.forEach(element => {
                ids.push(element.data.player_id);
            });
            const players = await Players.find({ _id: ids}).populate("user_id");

            user.invitations.forEach(element => {
                user.invitations["player"] = players.
                filter(el => el["user_id"].toString() == element.data.player_id.toString());
            });
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
    let playersList = [];
    if (id != undefined && id != "") {
        try {
            let team = await Teams.findOne({ _id: new ObjectId(id) }).populate("players");
            team.players.forEach(element => {
                ids.push(element.player);
            });
            
            const players = await Players.find({ _id: ids}).populate("user_id");

            
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

module.exports = controller;