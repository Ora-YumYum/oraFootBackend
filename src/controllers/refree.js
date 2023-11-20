



const Games = require("../models/games");
const Players = require("../models/users/players");


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

module.exports = controller;



