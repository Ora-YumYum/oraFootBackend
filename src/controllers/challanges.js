

const Challanges = require("../models/challanges");
const Users = require("../models/users/users");

const Invitation = require("../models/invitation");

const Notifications = require("../models/notifications");

const AppError = require("./errorController");
const Staduims = require("../models/users/staduims");

const { imageComproser } = require("../config/image-compr")

const { UPLOAD_DIR } = require("../../settings");
const Refeers = require("../models/users/refeers");
const Photographers = require("../models/users/photographers");

var controller = {}

controller.createChallange = async (req, res,) => {

    const user_id = req.userId;

    try {
        const {
            title, desc, staduim,
            match_type, numbers_of_players,
            price, payment_method,
            isPrivateGame, notifyRefree,
            notifyPhotographer,
            field_type,
            start_date,
            start_time,
            team,
        } = req.body;

        const challange = new Challanges({
            title: title,
            desc: desc,
            staduim: staduim,
            team: team,
            match_type: match_type,
            numbers_of_players: numbers_of_players,
            price: price,
            payment_method: payment_method,
            isPrivateGame: isPrivateGame,
            notifyRefree: notifyRefree,
            notifyPhotographer: notifyPhotographer,
            field_type: field_type,
            start_date: start_date,
            start_time: start_time,
        });

        if (req.files != undefined) {
            try {
                let userPic = req.files.image;

                let pic_name = (new Date().getTime()) + "-" + userPic.name;

                let uploadPath = UPLOAD_DIR + "/challenges/";

                const filePath = UPLOAD_DIR + "/temp-uploads/" + pic_name;

                challange.cover_img = pic_name;
                uploadImage(filePath, uploadPath, userPic.data);

            } catch (error) {
                console.log(error);
            }
        }

        let userExits = await Users.findOne({ _id: user_id }, {
        }).populate("team");

        await Users.updateOne({ _id: user_id }, {
            "$push": {
                "challanges": challange
            }
        })

        await Staduims.updateOne({ _id: staduim }, {
            "$push": {
                "challanges": challange
            }
        });

        let staduimInvite = Invitation({
            type: "invite_staduim",
            user_id: staduim,
            data: {
                "staduim_id": staduim,
                "challenge_id": challange._id,
                "team_name": userExits.team.team_name,
            },
            status: 2,
        });

        let notification = Notifications({
            type: "invite_staduim",
            invitation: staduimInvite,
            user_id: user_id,
            title: userExits.team.team_name,
        });

        await notification.save();

        await staduimInvite.save();

        let RefreeInvite = Invitation({
            type: "invite_refree",
            data: {
                "challenge_id": challange._id,
                "team_name": userExits.team.team_name,
            },
            status: 2,
        });

        let RefreeNotification = Notifications({
            type: "invite_refree",
            invitation: RefreeInvite,
            user_id: user_id,
            title: userExits.team.team_name,
        });

        let challengeWilaya = userExits.wilaya;
        console.log(challengeWilaya);
        const refreesInWilaya = await
            Users.updateMany({ "wilaya": { $eq: 16 }, "user_type": { $eq: 1 } }, {
                "$push": {
                    "invitations": RefreeInvite,
                    "notifications": RefreeNotification,
                }
            });

        console.log(refreesInWilaya)
        /*  */

        if (refreesInWilaya != null) {
            RefreeInvite.save();
            RefreeNotification.save();
        }

        await notification.save();

        await staduimInvite.save();

        challange.postedBy = user_id;

        await challange.save();

        return res.json({
            "success": true,
            "message": "ok",
            "data": challange,
        });

    } catch (error) {
        console.log(error);
        return AppError.onError(res, " error" + error);
    }
};




function uploadImage(filePath, uploadPath, pic) {
    const compression = 60;
    fs.writeFile(filePath, pic, async function (error) {
        if (error) throw error

        compressImages(filePath, uploadPath, { compress_force: false, statistic: true, autoupdate: true }, false,
            { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
            { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
            { svg: { engine: "svgo", command: "--multipass" } },
            { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
            async function (error, completed, statistic) {
                console.log("-------------")
                console.log(error)
                console.log(completed)
                console.log(statistic)
                console.log("-------------")

                try {
                    fs.unlink(filePath, function (error) {
                        if (error) {
                            console.log(error);
                        } else {

                        }
                    })
                } catch (error) {
                    return res.status(500).send({ success: false, message: "server error", results: null });

                }
            }
        )
    })
}




controller.getStaduimsByWilaya = async (req, res,) => {

    if (req.query.wilaya != undefined || req.query.wilaya != "" || req.query.wilaya != null) {
        let wilaya = Number.parseInt(req.query.wilaya);
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


controller.viewMyChallanges = async (req, res,) => {

    const id = req.userId;
    try {
        let challanges = await Challanges.find({
            $or: [{ 'postedBy': id },
            { 'opponent_team_id': id }],
        })
            .populate("staduim").populate("team").
            populate("invitation").populate("opponent_team").populate("game").exec();

        console.log(challanges)
        return res.status(200).send({
            "success": true,
            "challanges": challanges
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.viewAllChallanges = async (req, res,) => {

    try {
        let challanges = await Challanges.find({ status: 0, isPrivateGame: false })
            .populate("staduim").populate("team").
            populate("invitation").populate("opponent_team").exec();


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


controller.sendInvitation = async (req, res) => {

    const { player_id, team_id, team_name } = req.body;
    try {

        let playerExits = await Users.findOne({ _id: player_id });

        if (playerExits) {

            let invitation = Invitation({
                type: "team_invitation",
                user_id: player_id,
                data: {
                    "team_id": team_id,
                    "player_id": player_id,
                    "team_name": team_name,
                },
                status: 2,
            });

            let notification = Notifications({
                type: "invite_team",
                invitation: invitation,
                user_id: player_id,
                title: team_name,
            });
            await notification.save();

            await invitation.save();

            await Users.updateMany({ _id: { $in: [team_id.toString(), player_id.toString()] } }, {
                "$push": {
                    "invitations": invitation
                }
            },),
                await Users.updateOne({ _id: player_id }, {
                    "$push": {
                        "notifications": notification
                    },
                },),


                res.status(200).json({
                    "success": true,
                    "msg": "invitation was sent successfully",
                });
        } else {
            res.status(400).json({
                "success": false,
                "msg": "Invalid id",
            });
        }



    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "msg": error,
        });
    }
}

module.exports = controller;