


const Players = require("../models/users/players")

var controller = {};

controller.SearchForPlayers = async (req, res) => {

    const query = req.query.query;

    try {
        let response = await Players.aggregate([
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

module.exports = controller;