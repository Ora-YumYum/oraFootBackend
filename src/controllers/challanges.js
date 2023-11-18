

const Challanges = require("../models/challanges");
const AppError = require("./errorController");
const Staduims = require("../models/users/staduims");


var controller = {}

controller.createChallange = async (req, res,) => {

    const user_id = req.userId;

    try {
        const { title, desc, location,
            match_type, numbers_of_players,
            price, payment_method,
            isPrivateGame, showStandBy,
            enableCalls, chooseGender
        } = req.body;


        const challange = new Challanges({
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

        
        challange.postedBy = user_id;

        let response = await challange.save();

        return res.json({
            "success": true,
            "msg": "ok",
            "data": response,
        });
    } catch (error) {
        return AppError.onError(res, "restaurant add error" + error);
    }
};


controller.getStaduims = async (req, res,) => {

    let commune = req.body.commune;

    if (commune != undefined || commune != "" || commune != null) {
        try {
            let staduims = await Staduims.find({ address: commune})
            res.status(200).json({
                "success": true,
                "staduims": staduims
            });
        } catch (error) {
            return AppError.onError(error, "restaurant add error" + error);
        }
    }
};


controller.viewAllChallanges = async (req, res,) => {
    try {
        let challanges = await Challanges.find()
        res.status(200).json({
            "success": true,
            "challanges": challanges
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.deleteChallanges = async (req, res) => {
    const id = req.body._id;
    try {
        await Challanges.deleteOne({ _id: id })
        res.status(200).json({
            "success": true,
            "msg": "type was deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({});
    }
};


module.exports = controller;