

const Challanges = require("../models/challanges");
const AppError = require("./errorController");


var controller = {}

controller.createChallange = (req, res,) => {
    const { title, desc, location, match_type, numbers_of_players, price, payment_method,
        isPrivateGame, showStandBy, enableCalls, chooseGender
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

    challange
        .save()
        .then((challange) => {
            return res.json(challange);
        })
        .catch((err) => {
            return AppError.onError(res, "restaurant add error" + err);
        });
};

controller.viewAllChallanges = async (req, res, next) => {
    try {
        let challanges = await Challanges.find()
        res.status(200).json({
            success: true,
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
            success: true,
            "msg": "type was deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({});
    }
};


module.exports = controller;