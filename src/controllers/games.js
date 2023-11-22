

const Games = require("../models/games");
const Players = require("../models/users/players");


const controller = {}



controller.viewGames = async (req, res,) => {
    try {
        let games = await Games.find()
        res.status(200).json({
            "success": true,
            "games": games
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.getGameById = async (req, res,) => {
    const id = req.body.game_id;

    try {
        let game = await Games.findOne({ _id: id });
        res.status(200).json({
            "success": true,
            "game": game,
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};



module.exports = controller;

