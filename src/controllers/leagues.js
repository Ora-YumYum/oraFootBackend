


const Leagues = require("../models/leagues");
const AppError = require("./errorController");

const Staduims = require("../models/users/staduims");

const Users = require("../models/users/users");

const Teams = require("../models/users/Teams");

const Invitation = require("../models/invitation");

const Notifications = require("../models/notifications");

const { ObjectId } = require('mongodb');

var controller = {}

controller.createLeague = async (req, res,) => {

    const user_id = req.userId;

    console.log(user_id);
    const teamExits = await Users.findOne({ _id: user_id }).populate("team");

    console.log(teamExits);


    try {
        const { title, desc,
            min_teams_needed, teams,
            staduims,
            max_teams_needed,
            isPrivate,
            start_date,
            end_date,
        } = req.body;

        const league = new Leagues({
            title: title,
            desc: desc,
            staduims: staduims,
            max_teams_needed: max_teams_needed,
            min_teams_needed: min_teams_needed,
            isPrivate: isPrivate,
            // start_date: start_date,
            // end_date: end_date
        });


        if (req.files != undefined) {
            try {
                let userPic = req.files.image;

                let pic_name = (new Date().getTime()) + "-" + userPic.name;

                let uploadPath = UPLOAD_DIR + "/leagues/";

                const filePath = UPLOAD_DIR + "/temp-uploads/" + pic_name;

                league.cover_img = pic_name;
                uploadImage(filePath, uploadPath, userPic.data);

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
            title: teamExits.team.team_name,
        });

        await teams_notification.save();

        await teams_invite.save();

        league.teams_invitation = teams_invite;

        //league.teams_invitation = teams_invite;

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



controller.iviteStaduims = async (req, res) => {
    const { leauge_id, staduims_list, teams_list } = req.body;


    try {

        let staduims_invite_list = [];

        let staduims_invite = Invitation({
            type: "leagues_invite_staduims",
            user_id: user_id,
            data: staduims_invite_list,
            status: 2,
        });


        for (let index = 0; index < staduims_list.length; index++) {
            const element = staduims_list[index];
            staduims_invite_list.push({
                "staduim_id": element,
                "league_id": leauge_id._id,
                "invite_id": staduims_invite._id,
                "postedBy": user_id,
                "status": 2,
            });
        }

        let staduim_notification = Notifications({
            type: "leagues_invite_staduims",
            invitation: staduims_invite,
            user_id: user_id,
            title: teamExits.team.team_name,
        });

        await staduim_notification.save();

        await Users.updateMany({ _id: { $in: staduims } }, {
            "$push": {
                "invitations": staduims_invite,
                "notifications": staduim_notification,
            }
        },);

    } catch (error) {
        console.log(error);
    }
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
                "path" : "staduims",
                "select" : "staduim_name wilaya profile_img user_id _id",
            }).populate("teams_invitation").populate("games").populate("teams")
            .exec();

        let ids = [];
        let teams_list = [];

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

        league_info  = league;

        league_info["teams_list"] = teams_list;

        res.status(200).json({
            "success": true,
            "leagues": league_info
        });

    } catch (error) {
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

    const { team_id, postedBy, invitation_id, } = req.body;

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

        await Invitation.updateOne({ _id: invitation_id, "data.team_id": new ObjectId(team_id) }, {
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

controller.accepteLeagueInvitationStaduim = async (req, res) => {

    const { staduim_id, postedBy, invitation_id, } = req.body;

    try {

        let staduimExits = await Users.findOne({ _id: team_id }).populate("staduim");

        let notification = Notifications({
            type: "staduim_accepted_leauge_invitation",
            user_id: staduimExits._id,
            title: staduimExits.staduim.staduim_name,
            img: staduimExits.staduim.profile_img,
            invitation: invitation_id
        });

        await notification.save();

        await Users.updateOne({ _id: postedBy, }, {
            "$push": {
                "notifications": notification
            },
        },);

        await Invitation.updateOne({ _id: invitation_id, "data.staduim_id": new ObjectId(staduim_id) }, {
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

module.exports = controller;
/*let dividend = teams.length;
let divisor = 4;
let result = dividend / divisor;

let groups = [];

if(teams.length>4){
if(result!=1){
let groupsName = ["A","B","C","D","E","F"];
 
for (let index = 0; index < (teams.length/4); index++) {
const element = teams[index];
let teams_to_invite = [];
let teams_index = index;
for (let i = (teams_index*4); i < (index+1)*4; i++) {
  const my_teams = teams[i];
  if(my_teams!= undefined) {
   teams_to_invite.push(my_teams);
  }
}
console.log(teams_to_invite.length)
 if(teams_to_invite.length == 3 || teams_to_invite.length==1){
 
}else{
 groups.push({
 "group" : groupsName[index],
 "teams" : teams_to_invite,
})
}
}
}

}*/