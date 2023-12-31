



const Games = require("../models/games");
const Players = require("../models/users/players");
const Users = require("../models/users/users");
const Notifications = require("../models/notifications");
const Invitation = require("../models/invitation");
const AppError = require("./errorController");

const Teams = require("../models/users/Teams")
const Challenges = require("../models/challanges");



const Refrees = require("../models/users/refeers");


const controller = {}






controller.viewMyGames = async (req, res,) => {

    const refree_id = req.userId;

    const status = Number.parseInt(req.query.status);

    try {
        let challenges = await Challenges.find({
            refree: refree_id,
            status: status
        })
            .populate("postedBy").populate("refree").populate("game").
            populate("invitation").populate("opponent_team").populate("staduim").populate("team");

        console.log(challenges)
        return res.status(200).send({
            "success": true,
            "challenges": challenges
        });
    } catch (error) {
        console.log(error);
        return AppError.onError(error, "restaurant add error" + error);
    }
};




controller.startGame = async (req, res,) => {

    const { type, game_id, challenge_id, first_team, second_team, } = req.body;

    try {

        let game = Games({
            challenge_id: challenge_id,
            first_team: first_team,
            second_team: second_team,
        });

        if (type == "Challenge") {
            game.challenge_id = challenge_id;
            await Challenges.updateOne({
                _id: challenge_id,
            }, {
                "game": game,
            });
            await game.save();
        } else {
            await Games.updateOne({
                _id: game_id,
            }, {
                "games_status": 1,
            });
        }


        return res.status(200).send({
            "success": true,
            "message": "Game started successfully",
            "game": game,
        });

    } catch (error) {
        return res.status(500).send({
            "success": false,
            "message": error
        });
    }
};


controller.endGame = async (req, res,) => {

    const { type, challenge_id, game_id, first_team, second_team, } = req.body;

    try {

        let game = await Games.findOne({ _id: game_id });

        let winner;
        if (game != null) {
            if (game.first_team_goals > game.second_team_goals) {
                winner = first_team;
            } else {
                winner = second_team;
            }
        }

        await Games.updateOne({
            _id: game_id,
        }, {
            "$set": {
                "games_status": 0,
                "winner": winner,
            }
        });

        if (type == "Challenge") {
            await Challenges.updateOne({
                _id: challenge_id,
            }, {
                "$set": {
                    "status": 0,
                }
            });
        } else {
            await Games.updateOne({
                _id: game_id,
            }, {
                "$set": {
                    "status": 0,
                }
            });
        }



        await Teams.updateMany({
            _id: { $in: [first_team, second_team] },
        }, {
            "$push": {
                "games": game_id,
            }
        });

        return res.status(200).send({
            "success": true,
            "message": "Game Ended successfully",
            "game": {
            },
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            "success": false,
            "message": error
        });
    }
};

controller.updateGoals = async (req, res) => {

    const { game_id, player_id, team } = req.body;

    try {

        let update = {}

        if (team == 1) {
            update = {
                "$push": {
                    "first_team_goals": {
                        "player": player_id,
                        'date': Date.now(),
                    }
                }
            }
        } else {
            update = {
                "$push": {
                    "second_team_goals": {
                        "player": player_id,
                        'date': Date.now(),
                    }
                }
            }
        }

        await Games.updateOne({ _id: game_id }, update);

        await Players.updateOne({
            "$push": {
                "goals": {
                    "game": game_id,
                }
            }
        });
        res.status(200).json({
            success: true,
            "message": "type was updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).jsons({
            "success": false,
            "message": "something happpend please try again later",
        });
    }
}

controller.updateFouls = async (req, res) => {

    const { game_id, player_id, team } = req.body;

    try {

        let update = {}

        if (team == 1) {
            update = {
                "$push": {
                    "first_team_fouls": {
                        "player": player_id,
                        'date': Date.now(),
                    }
                }
            }
        } else if (team == 2) {
            update = {
                "$push": {
                    "second_team_fouls": {
                        "player": player_id,
                        'date': Date.now(),
                    }
                }
            }
        }

        await Games.updateOne({ _id: game_id }, update);

        await Players.updateOne({
            "$push": {
                "fouls": {
                    "game": game_id,
                }
            }
        });
        res.status(200).json({
            success: true,
            "message": "type was updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).jsons({
            "success": false,
            "message": "something happpend please try again later",
        });
    }
}


controller.updateCorners = async (req, res) => {

    const { game_id, player_id, team } = req.body;

    try {

        let update = {}

        if (team == 1) {
            update = {
                "$push": {
                    "first_team_corners": {
                        "player": player_id,
                        'date': Date.now(),
                    }
                }
            }
        } else if (team == 2) {
            update = {
                "$push": {
                    "second_team_corners": {
                        "player": player_id,
                        'date': Date.now(),
                    }
                }
            }
        }

        await Games.updateOne({ _id: game_id }, update);

        await Players.updateOne({
            "$push": {
                "fouls": {
                    "game": game_id,
                }
            }
        });
        res.status(200).json({
            success: true,
            "message": "type was updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).jsons({
            "success": false,
            "message": "something happpend please try again later",
        });
    }
}


controller.updateCards = async (req, res) => {

    const { game_id, player_id, card, team } = req.body;

    try {

        let update = {}

        if (team == 1) {
            update = {
                "$push": {
                    "first_team_cards": {
                        "player": player_id,
                        "card": card,
                        'date': Date.now(),
                    }
                }
            }

        } else if (team == 2) {
            update = {
                "$push": {
                    "second_team_cards": {
                        "player": player_id,
                        "card": card,
                        'date': Date.now(),
                    }
                }
            }
        }

        await Games.updateOne({ _id: game_id }, update);
        res.status(200).json({
            success: true,
            "message": "type was updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).jsons({
            "success": false,
            "message": "something happpend please try again later",
        });
    }
}


controller.uploadPhotos = async (req, res) => {

    const { id, player_id, date, card } = req.body;

    try {
        await Games.updateOne({ _id: id }, {
            "$push": {
                "cards": {
                    "player": player_id,
                    "date": date,
                    "card": card,
                }
            }
        });
        res.status(200).json({
            success: true,
            "message": "type was updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).jsons({
            "success": false,
            "message": "something happpend please try again later",
        });
    }
}


controller.getMyChallenges = async (req, res) => {
    const id = req.userID;
    if (id != undefined && id != "" || id != null) {
        try {

            const challenges = await Users.findOne({ _id: id }).populate({ path: "challanges" });

            if (!challenges) {
                res.status(200).send({
                    "success": true, "message": "ok", results: {
                        "challenges": challenges,
                    },
                });

            } else {
                res.status(200).send({
                    "success": false, "message": "Invalid id", results: {
                        "challenges": null,
                    },
                });
            }

        } catch (error) {
            console.log(error);
            res.status(500).send({ success: false, message: "Server Error", results: null });
        }
    } else {
        res.status(400).send({ success: false, message: "please enter an id " });
    }
}


controller.accepteInvitation = async (req, res) => {

    const { challenge_id, refree_user_id, refree_name, invitation_id, } = req.body;

    try {

        let refreeExits = await Users.findOne({ _id: refree_user_id });

        let challengeExits = await Challenges.findOne({ _id: challenge_id });

        let notification = Notifications({
            type: "refree_accepted_invitation",
            user_id: refree_user_id,
            title: refree_name,
            img: refreeExits.profile_img,
            invitation: invitation_id
        });

        await notification.save();

        await Invitation.updateOne({ _id: invitation_id }, {

            "$set": {
                "status": 0,
            }
        });

        await Challenges.updateOne({ _id: challenge_id }, {
            "$set": {
                "refree": refree_user_id,
            },
        });

        await Users.updateOne({ _id: challengeExits.postedBy, }, {
            "$push": {
                "notifications": notification
            },
        },);

        await Games.updateOne({ "_id": challengeExits.game, }, {
            "refree": refree_user_id,
        });

        return res.status(200).json({
            "success": true,
            "msg": "Invitation was accepted successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "msg": error,
        });
    }
}


//// view refree challenges

controller.viewMyChallanges = async (req, res,) => {

    const id = req.userId;
    console.log(id)
    try {
        let challanges = await Challenges.find({
            'refree': id
        }).populate("staduim").populate("team").populate("refree").
            populate("invitation").populate("opponent_team_id").populate("game").exec();

        return res.status(200).send({
            "success": true,
            "challanges": challanges
        });

    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.viewMyLeauges = async (req, res,) => {

    const id = req.userId;
    console.log(id)
    try {
        let challanges = await Challenges.find({
            'refree': id
        }).populate("staduim").populate("team").populate("refree").
            populate("invitation").populate("opponent_team_id").populate("game").exec();

        return res.status(200).send({
            "success": true,
            "challanges": challanges
        });

    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.viewGames = async (req, res,) => {

    const id = req.userId;


    const status = Number.parseInt(req.query.status);

    console.log(status);

    let games;

    if (status == 0) {
        games = await Games.find({
            'refree': id,
            "games_status": status,
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
            }).populate({
                "path": "challenge_id",
                "populate": {
                    "path": "staduim team opponent_team refree game",
                    "select": "staduim_name user_id team_name _id wilaya profile_img cover_img location main_color secondary_color"
                }
            }).exec();
    } else if (status == 2) {
        games = await Games.find({}).populate({
            "path": "staduim",
            "match": {
                'refree': id,
                "games_status": {
                    "$in": [1, 2],
                }
            },
            "select": "staduim_name wilaya user_id _id location cover_img"
        }).populate({
            "path": "first_team",
            "select": "team_name wilaya user_id _id profile_img main_color secondary_color players"
        }).populate("refree")
            .populate({
                "path": "second_team",
                "select": "team_name wilaya user_id _id profile_img main_color secondary_color players"
            }).populate({
                "path": "challenge_id",
                "populate": {
                    "path": "staduim team opponent_team refree game",
                    "select": "staduim_name user_id team_name _id wilaya profile_img cover_img location main_color secondary_color"
                }
            }).exec();
    }
    try {
        return res.status(200).send({
            "success": true,
            "games": games,
        });

    } catch (error) {
        console.log(error);
        return AppError.onError(error, "restaurant add error" + error);
    }
};




module.exports = controller;



