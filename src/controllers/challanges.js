

const Challanges = require("../models/challanges");
const Users = require("../models/users/users");

const AppError = require("./errorController");
const Staduims = require("../models/users/staduims");


var controller = {}

controller.createChallange = async (req, res,) => {

    const user_id = req.userId;

    try {
        const { title, desc, location,
            match_type, numbers_of_players,
            price, payment_method,
            isPrivateGame, notifyRefree,
            notifyPhotographer, chooseGender
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
            notifyRefree: notifyRefree,
            notifyPhotographer: notifyPhotographer,
            chooseGender: chooseGender
        });


        challange.postedBy = user_id;

        let reponse = await Users.updateOne({ _id: user_id }, {
            "$push": {
                "challanges": challange
            }
        })

        let response = await challange.save();

        return res.json({
            "success": true,
            "message": "ok",
            "data": response,
        });
    } catch (error) {
        return AppError.onError(res, "restaurant add error" + error);
    }
};


controller.getStaduimsByWilaya = async (req, res,) => {



    if (req.query.wilaya != undefined || req.query.wilaya != "" || req.query.wilaya != null) {
        let wilaya = Number.parseInt(wilaya);
        try {
            let staduims = await Staduims.find({ wilaya: wilaya })
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
            "message": "type was deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({});
    }
};


controller.changeStatus = async (req, res) => {
    const id = req.body._id;
    const value = req.body.balue;

    if (value == "boolean") {
        try {
            await Challanges.updateOne({ _id: id }, {
                $set: {
                    "isPrivateGame": value
                }
            })
            res.status(200).json({
                "success": true,
                "message": "status updated successfully"
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                "message": error,
                "success": false,
            });
        }
    } else {
        res.status(400).json({
            "message": "invalid value",
            "success": false,
        });
    }

};


module.exports = controller;