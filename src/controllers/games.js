

const Games = require("../models/games");
const Players = require("../models/users/players");


const controller = {}



controller.viewGames = async (req, res,) => {


    try {

        let games = await Games.find().populate("first_team").populate("second_team")
        res.status(200).json({
            "success": true,
            "games": games
        });

    } catch (error) {
        console.log(error);
        return AppError.onError(error, "restaurant add error" + error);
    }
    
};


controller.getGames = async (req, res,) => {

    try {
        let games = await Games.find({});
        res.status(200).json({
            "success": true,
            "games": games,
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};



module.exports = controller;

