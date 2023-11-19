


const Leagues = require("../models/leagues");
const AppError = require("./errorController");




var controller = {}

controller.createLeagues = async (req, res,) => {

    try {
        const { title, desc, location, match_type, numbers_of_players, price, payment_method,
            isPrivateGame, showStandBy, enableCalls, chooseGender
        } = req.body;

        const leagues = new Leagues({
            title: title,
            desc: desc,
            location: location,
            match_type: match_type,
            numbers_of_players: numbers_of_players,
            price: price,
            payment_method: payment_method,
            isPrivateGame: isPrivateGame,
            showStandBy: showStandBy,
            enableCalls: enableCalls,
            chooseGender: chooseGender
        });

        let response = await leagues.save();

        return res.json({
            "success": true,
            "msg": "ok",
            "data": response,
        });
    } catch (error) {
        return AppError.onError(res, "restaurant add error" + error);
    }


};


controller.getMyLeagues = async (req, res,) => {
    try {
        let Leagues = await Leagues.find()
        res.status(200).json({
            "success": true,
            "msg": "0k",
            "Leagues": Leagues
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};

controller.getAvailableLeagues = async (req, res,) => {
    try {
        let Leagues = await Leagues.find({ league_status: 1 })
        res.status(200).json({
            "success": true,
            "msg": "0k",
            "Leagues": Leagues
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


module.exports = controller;


