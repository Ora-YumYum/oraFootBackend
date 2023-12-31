


const Leagues = require("../models/leagues");
const AppError = require("./errorController");


const compressImages = require("compress-images")

const Staduims = require("../models/users/staduims");

const Users = require("../models/users/users");

const Teams = require("../models/users/Teams");

const Invitation = require("../models/invitation");

const Notifications = require("../models/notifications");

const { ObjectId } = require('mongodb');

const { UPLOAD_DIR } = require("../../settings");

const Games = require("../models/games")

const fs = require('fs');


const Rounds = require("../models/rounds");
const { json } = require("body-parser");

var controller = {}


let round1 = {
    "games": [
    ],
    "winners": [],
};
let round2 = {
    "games": [
    ],
    "winners": [],
};
let round3 = {
    "games": [
    ],
    "winners": [],
};
let final = {
    "games": [
    ],
    "winners": [],
};

let groupsName = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "M"];


function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');

    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function createGroups(list_loop, round, teams, start_date, end_date) {
    loop = Math.round(list_loop)
    for (let index = 0; index < loop; index++) {

        round.games.push(
            {
                "first_team": groupsName[index],
                "first_team_id": teams[index],
                "second_team_id": teams[index + loop],
                "second_team": groupsName[index + loop],
                "status": 2,
                "game_id": randomString(9),
            }
        );
    }
}

function createRounds(teams, round, start_date, end_date) {
    let dividend = teams.length;
    let divisor = 2;
    let result = dividend % divisor;

    let groups = [];

    console.log(result)
    if (result == 1) {
        createGroups(((teams.length) / 2) - 1, round, teams, start_date, end_date,);
        let lastElement = groupsName[teams.length - 1];

        round.winners.push(
            {
                "team": lastElement,
            }
        );
    } else {
        createGroups((teams.length) / 2, round, teams);
    }
    ;
    return round;
}




controller.iviteStaduims = async (req, res) => {

    const id = req.userId;
    const { leauge_id, } = req.body;


    try {

        const league = await Leagues.findOne({ _id: leauge_id }).populate({
            "path": "postedBy",
            "select": "team_name _id user_id "
        });

        if (league) {

            const staduims_list = league.staduims;
            const staduims_user_id_list = [];
            const teams_list = league.teams;

            if (teams_list.length != 0 || teams_list.length != 1) {


                let round = createRounds(teams_list, round1,);

                let games = [];

                games = [];

                for (let index = 0; index < round.games.length; index++) {
                    const element = round.games[index];
                    let game = Games({
                        first_team: element.first_team_id,
                        second_team: element.second_team_id,
                        first_team_hint: element.first_team,
                        second_team_hint: element.second_team,
                        games_status: 3,
                        game_id: element.game_id,
                    });
                    games.push(game);
                }

                let response = await Games.insertMany(games);

                let roundOne = Rounds({
                    round: 1,
                    games: games,
                    winners: round.winners,
                    teams: teams_list,
                    published_by: id,
                });

                await roundOne.save();

                let staduims_invite_list = [];

                let staduims_invite = Invitation({
                    type: "leagues_invite_staduims",
                    user_id: id,
                    data: {
                        "round_data": round,
                        "leauge_data": {
                            "league_id": league._id,
                            "postedBy": id,
                            "status": 2,
                            "start_date": league.start_date,
                            "end_date": league.end_date,
                        }
                    },
                    status: 2,
                });


                let staduim_notification = Notifications({
                    type: "leagues_invite_staduims",
                    invitation: staduims_invite,
                    user_id: id,
                    title: league.team_name,
                });

                await staduims_invite.save();

                await staduim_notification.save();

                await Leagues.updateOne({ _id: leauge_id, }, {
                    "$set": {
                        "staduim_invitation": staduims_invite,
                        "roundOne": roundOne,
                    }
                });
                const StaduimsIds = await Staduims.find({ _id: { $in: staduims_list } }).
                    populate("user_id").select("_id");

                for (let index = 0; index < StaduimsIds.length; index++) {
                    const element = StaduimsIds[index];
                    staduims_user_id_list.push(element["user_id"]["_id"]);
                }

                console.log(staduims_user_id_list)

                await Users.updateMany({ _id: { $in: staduims_user_id_list } }, {
                    "$push": {
                        "invitations": staduims_invite,
                        "notifications": staduim_notification,
                    }
                },);

                return res.json({
                    "success": true,
                    "message": "ok",
                    "data": staduims_invite,
                });
            }


        } else {
            return res.json({
                "success": false,
                "message": "invalid league id",
                "data": null
            });
        }

    } catch (error) {
        console.log(error);
    }
}



controller.createLeague = async (req, res,) => {

    const user_id = req.userId;


    const teamExits = await Users.findOne({ _id: user_id }).populate("team");

    let body = JSON.parse(req.body.leauge);

    try {
        const {
            title, desc,
            staduims,
            teams,
            max_teams_needed,
            min_teams_needed,
            isPrivate,
            start_date,
            end_date
        } = body;

        const league = new Leagues({
            title: title,
            desc: desc,
            staduims: staduims,
            max_teams_needed: max_teams_needed,
            min_teams_needed: min_teams_needed,
            isPrivate: isPrivate,
            start_date: start_date,
            end_date: end_date,
        });

        if (req.files != null) {
            try {
                let userPic = req.files.image;

                let pic_name = (new Date().getTime()) + "-" + userPic.name;

                let uploadPath = UPLOAD_DIR + "/leagues/";

                const filePath = UPLOAD_DIR + "/temp-uploads/" + pic_name;

                league.cover_img = pic_name;

                const compression = 60;

                fs.writeFile(filePath, userPic.data, async function (error) {
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
            } catch (error) {
                console.log(error);
            }
        }

        league.postedBy = user_id;

        let teams_invite_list = [];

        let teams_invite = Invitation({
            type: "leagues_invite_teams",
            user_id: user_id,
            data: teams_invite_list,
            status: 2,
        });

        for (let index = 0; index < teams.length; index++) {
            const element = teams[index];
            teams_invite_list.push({
                "team_id": element,
                "league_id": league._id,
                "invite_id": teams_invite._id,
                "postedBy": user_id,
                "status": 2,
            });
        }

        let teams_notification = Notifications({
            type: "leagues_invite_teams",
            invitation: teams_invite,
            user_id: user_id,
            img: "teamExits.team.team_name",
            title: teamExits.team.team_name,
        });

        await teams_notification.save();

        await teams_invite.save();

        league.teams_invitation = teams_invite;

        await Users.updateMany({ _id: { $in: teams } }, {
            "$push": {
                "invitations": teams_invite,
                "notifications": teams_notification,
            }
        },);

        let response = await league.save();

        return res.json({
            "success": true,
            "message": "ok",
            "data": response,
        });
    } catch (error) {
        console.log(error);
        return AppError.onError(res, "opps something happend" + error);
    }
};



function uploadImage(filePath, uploadPath, pic) {
    const compression = 60;
    fs.writeFile(filePath, pic, async function (error) {
        if (error) throw error

        compressImages(filePath, uploadPath.data, { compress_force: false, statistic: true, autoupdate: true }, false,
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


controller.viewMyLeagues = async (req, res,) => {

    const id = req.userId;

    console.log(id)
    try {
        let leagues = await Leagues.find({ "postedBy": id })
            .populate("staduims").populate("teams_invitation").populate("games").populate("teams")
            .exec();

        res.status(200).json({
            "success": true,
            "leagues": leagues
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.getLeagueById = async (req, res) => {

    const id = req.query.id;

    let league_info = {};
    try {

        let league = await Leagues.findOne({ "_id": id })
            .populate({
                "path": "staduims",
                "select": "staduim_name wilaya profile_img user_id _id",
            }).populate("teams_invitation").populate("staduim_invitation").populate({
                "path": "roundOne",
                "populate": {
                    "path": "games",
                    "populate": {
                        "path": "staduim first_team second_team",
                        "select": "staduim_name user_id team_name _id wilaya profile_img cover_img"
                    }
                }
            }).populate("roundTwo").populate("roundThree")
            .exec();

        let ids = [];
        let staduims_ids = [];
        let teams_list = [];

        let staduims_list = [];

        league.teams_invitation.data.forEach(element => {
            ids.push(element.team_id);
        });

        const teams = await Users.find({ _id: { $in: ids } }).populate({
            "path": "team",
            "select": "team_name wilaya profile_img _id"
        }).select("team _id")


        for (let index = 0; index < ids.length; index++) {

            let id = league.teams_invitation.data[index]["team_id"];

            let element = league.teams_invitation.data[index];

            element["team_info"] = teams.
                filter(el => el["_id"] == id);
            teams_list.push(element);
        }

        league_info = league;

        league_info["teams_list"] = teams_list;


        res.status(200).json({
            "success": true,
            "leagues": league_info
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "error": error
        });
    }
}


controller.viewAllLeagues = async (req, res,) => {

    try {
        let leagues = await Leagues.find({ status: 2, })
            .populate("staduims").populate("teams_invitation").populate("games").populate("teams")
            .exec();
        res.status(200).json({
            "success": true,
            "leagues": leagues
        });
    } catch (error) {
        return AppError.onError(error, "restaurant add error" + error);
    }
};


controller.accepteLeagueInvitation = async (req, res) => {

    const { team_id, postedBy, invitation_id, leauge_id } = req.body;

    try {

        let team_nameExits = await Users.findOne({ _id: team_id }).populate("team");


        let notification = Notifications({
            type: "team_accepted_leauge_invitation",
            user_id: team_nameExits._id,
            title: team_nameExits.team.team_name,
            img: team_nameExits.team.profile_img,
            invitation: invitation_id
        });

        await notification.save();

        await Users.updateOne({ _id: postedBy, }, {
            "$push": {
                "notifications": notification
            },
        },);

        await Leagues.updateOne({ _id: leauge_id, }, {
            "$push": {
                "teams": team_id
            },
        },);

        await Invitation.updateOne({ _id: new ObjectId(invitation_id), "data.team_id": team_id }, {
            "$set": {
                "data.$.status": 0
            },
        },);

        res.status(200).json({
            "success": true,
            "msg": "invitation was accepted successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "msg": error,
        });
    }
}


controller.accepteRefreeInvitation = async (req, res) => {

    const { refree_id, invitation_id, leauge_id , game_id} = req.body;

    try {

        let refreeExits = await Users.findOne({ _id: refree_id });

        let leaugeExits = await Leagues.findOne({ _id: leauge_id });


        let notification = Notifications({
            type: "refree_accepeted_leauge_invitation",
            user_id: refreeExits._id,
            title: refreeExits.first_name + refreeExits.second_name,
            img: refreeExits.profile_img,
            invitation: invitation_id
        });

        await notification.save();

        await Users.updateOne({ _id: leaugeExits.postedBy }, {
            "$push": {
                "notifications": notification
            },
        },);

        await Leagues.updateOne({ _id: leaugeExits._id, }, {
            "$push": {
                "games": game_id
            },
        },);

        await Games.updateOne({ game_id: game_id, }, {
            "$set": {
                "refree": refree_id,
                "start_time": scheduled_date,
            },
        });

        await Invitation.updateOne({ _id: new ObjectId(invitation_id), }, {
            "$set": {
                "status": 0
            },
        },);


        res.status(200).json({
            "success": true,
            "msg": "invitation was accepted successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "msg": error,
        });
    }
}


controller.accepteLeagueInvitationStaduim = async (req, res) => {

    const { staduim_id, postedBy, invitation_id, league_id, game_id, scheduled_date } = req.body;

    try {

        let staduimExits = await Staduims.findOne({ _id: staduim_id }).populate("user_id");

        console.log(staduimExits)

        let postedByExits = await Users.findOne({ _id: postedBy }).populate("team");

        let notification = Notifications({
            type: "staduim_accepted_leauge_invitation",
            user_id: staduimExits.user_id._id,
            title: staduimExits.staduim_name,
            img: staduimExits.profile_img,
            invitation: invitation_id
        });

        await notification.save();

        await Users.updateOne({ _id: postedBy, }, {
            "$push": {
                "notifications": notification
            },
        },);

        await Invitation.updateOne({
            _id: invitation_id,
            "data.round_data.games.game_id": game_id,
        }, {
            "$set": {
                "data.round_data.games.$.status": 0
            },
        },);

        let game = await Games.findOne({ game_id: game_id, }, {});

        let RefreeInvite = Invitation({
            type: "leauge_invite_refrees",
            data: {
                "leauge_id": league_id,
                "game_id": game_id,
                "game": game,
            },
            status: 2,
        });

        let RefreeNotification = Notifications({
            type: "leauge_invite_refrees",
            invitation: RefreeInvite,
            user_id: postedByExits._id,
            title: postedByExits.team.team_name,
            img: postedByExits.team.profile_img,
        });

        RefreeInvite.save();
        RefreeNotification.save();
        let challengeWilaya = postedByExits.team.wilaya;

        await
            Users.updateMany({ "wilaya": { $eq: challengeWilaya }, "user_type": { $eq: 1 } }, {
                "$push": {
                    "invitations": RefreeInvite,
                    "notifications": RefreeNotification,
                }
            });

        await Games.updateOne({ game_id: game_id, }, {
            "$set": {
                "staduim": staduimExits._id,
                "start_date": scheduled_date,
            },
        });

        res.status(200).json({
            "success": true,
            "msg": "invitation was accepted successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "msg": error,
        });
    }
}

module.exports = controller;

/*let teams = [{
    team : "1",
},{
    team : "2",
},{
    team : "3",
},{
    team : "4",
},{
    team : "5",
},{
    team : "6"
},{
    team : "7",
},{
    team : "8"
},{
    team : "9"
}];

let dividend = teams.length;
let divisor = 2;
let result = dividend % divisor;

let groups = [];

let round1 = {
    "games" : [
        ],
        "winners" : [],
};
let round2 = {};
let round3 = {};
let final = {};


let groupsName = ["A","B","C","D","E","F","G","H","K"];


function exits(id){
     let exists = round1.games.
    filter(el => el["first_team"]== id);
console.log(exists)
if(exists){
    return true;
}else{
    return false;
}
}
let current_index = 0;
function  createGroups (list_loop) {
    loop = Math.round(list_loop)
for (let index = 0; index < loop; index++) {
    console.log(loop)
 const element = teams[index];
 let teams_index = index;

       // console.log(groupsName[index]);
        
        round1.games.push(
         {
            "first_team" :   groupsName[index],
            //"first_team_id" :teams[index]["team"],
            //"second_team_id" :teams[index+2]["team"],
            "second_team":  groupsName[index+loop],
         }
         );
}
 }
 console.log(result)
 if(result == 1){
     createGroups(((teams.length)/2)-1);
     let lastElement = groupsName[teams[teams.length-3]];
     console.log(lastElement)
      round1.winners.push(
         {
             "team" : lastElement,
         }
         );
 } else{
     createGroups((teams.length)/2);
 }

console.log(round1);*/
