


const Players = require("../models/users/players")

const Users = require("../models/users/users")


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

module.exports = controller;