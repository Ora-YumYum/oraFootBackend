


const Leagues = require("../models/leagues");
const AppError = require("./errorController");

const Staduims = require("../models/users/staduims");



var controller = {}

controller.createLeague = async (req, res,) => {

    const user_id = req.userId;

    try {
        const { title, desc, staduim,
            match_type, numbers_of_players,
            price, payment_method,
            isPrivateGame, notifyRefree,
            notifyPhotographer,
            field_type,
            start_date,

        } = req.body;

        const league = new Leagues({
            title: title,
            desc: desc,
            staduim: staduim,
            match_type: match_type,
            numbers_of_players: numbers_of_players,
            price: price,
            payment_method: payment_method,
            isPrivateGame: isPrivateGame,
            notifyRefree: notifyRefree,
            notifyPhotographer: notifyPhotographer,
            field_type: field_type,
        });

        console.log(req.files);
        if (req.files != undefined) {
            try {
                let userPic = req.files.image;

                let pic_name = (new Date().getTime()) + "-" + userPic.name;

                let uploadPath = UPLOAD_DIR + "/challenges/";

                const filePath = UPLOAD_DIR + "/temp-uploads/" + pic_name;

                league.cover_img = pic_name;
                uploadImage(filePath, uploadPath, userPic.data);

            } catch (error) {
                console.log(error);
            }
        }

        league.postedBy = user_id;

        //const opponent_team_exits = await Users.findeOne({ _id: opponent_team })

        /*if (!opponent_team_exits) {

        }*/

        const reponse = await Users.updateOne({ _id: user_id }, {
            "$push": {
                "challanges": challange
            }
        })


        const staduimResponse = await Staduims.updateOne({ _id: staduim }, {
            "$push": {
                "leagues": league
            }
        })


        let response = await league.save();

        return res.json({
            "success": true,
            "message": "ok",
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
            "message": "0k",
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
            "message": "0k",
            "Leagues": Leagues
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


module.exports = controller;


