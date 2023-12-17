


const Leagues = require("../models/leagues");
const AppError = require("./errorController");

const Staduims = require("../models/users/staduims");

const Users = require("../models/users/users");

const Invitation = require("../models/invitation");

const Notifications = require("../models/notifications");

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
            team_name,
        } = req.body;

        const league = new Leagues({
            title: title,
            desc: desc,
            max_teams_needed: max_teams_needed,
            min_teams_needed: min_teams_needed,
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

        let staduims_invite_list = [];

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

        let staduims_invite = Invitation({
            type: "leagues_invite_staduims",
            user_id: user_id,
            data: staduims_invite_list,
            status: 2,
        });

        for (let index = 0; index < staduims.length; index++) {
            const element = staduims[index];
            staduims_invite_list.push({
                "staduim_id": element,
                "league_id": league._id,
                "invite_id": staduims_invite._id,
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

        let staduim_notification = Notifications({
            type: "leagues_invite_staduims",
            invitation: staduims_invite,
            user_id: user_id,
            title: teamExits.team.team_name,
        });

        await staduim_notification.save();

        await teams_notification.save();

        await teams_invite.save();

        await staduims_invite.save();

        await Users.updateMany({ _id: { $in: teams } }, {
            "$push": {
                "invitations": teams_invite,
                "notifications": teams_notification,
            }
        },);

        await Users.updateMany({ _id: { $in: staduims } }, {
            "$push": {
                "invitations": staduims_invite,
                "notifications": staduim_notification,
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