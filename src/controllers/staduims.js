



const Challanges = require("../models/challanges");
const AppError = require("./errorController");
const Staduims = require("../models/users/staduims");


var controller = {}

controller.getStaduims = async (req, res,) => {

    let commune = Number.parseInt(req.body.commune);

    if (commune != undefined || commune != "" || commune != null) {

        try {
            let staduims = await Staduims.find({ address: commune })
            res.status(200).json({
                "success": true,
                "staduims": staduims
            });
        } catch (error) {

            return AppError.onError(error, "restaurant add error" + error);
        }
    }
};


controller.viewAllStaduims = async (req, res,) => {
    try {
        let staduims = await Staduims.find()
        res.status(200).json({
            "success": true,
            "message": "ok",
            "staduims": staduims
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.deleteStaduim = async (req, res) => {
    const id = req.body._id;
    try {
        await Staduims.deleteOne({ _id: id })
        res.status(200).json({
            "success": true,
            "message": "type was deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({});
    }
};


module.exports = controller;