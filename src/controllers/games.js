

const Games = require("../models/games");
const Players = require("../models/users/players");


const controller = {}



controller.viewGames = async (req, res,) => {
    try {
        let games = await Games.find().populate("first_team").
            populate("second_team").populate("challenge_id")
        res.status(200).json({
            "success": true,
            "games": games
        });
    } catch (error) {
        console.log(error);
        return AppError.onError(error, "restaurant add error" + error);
    }

};


controller.activeGames = async (req, res,) => {

    const id = req.userId;
    let games;

    
    games = await Games.find({
        "games_status": 1,
    }).populate({
        "path": "staduim",
        "select": "staduim_name wilaya user_id _id location cover_img"
    }).populate({
        "path": "first_team",
        "select": "team_name wilaya user_id _id profile_img main_color secondary_color players"
    }).populate("refree")
        .populate({
            "path": "second_team",
            "select": "team_name wilaya user_id _id profile_img main_color secondary_color players"
        }).populate("challenge_id").exec();

    try {
        return res.status(200).send({
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