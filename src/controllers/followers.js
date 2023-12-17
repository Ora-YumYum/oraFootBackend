
const Users = require("../models/users/users")

const Refrees = require("../models/users/refeers")

const Players = require("../models/users/players")

const Staduims = require("../models/users/staduims")

var controller = {};


function getPath(user_type) {
    let path = "";

    switch (user_type) {
        case 0:
            path = "team";
            break;
        case 1:
            path = "refree";
            break;
        case 2:
            path = "photographer";
            break;
        case 3:
            path = "doctor";
            break;
        case 4:
            path = "staduim";
            break;
        case 5:
            path = "player";
            break;
        default:
            break;
    }
    return path;
}


controller.follow = async (req, res) => {
    const user_id = req.userId;
    const id = req.body.id;
    try {

        const userFound = await Users.findOne({ _id: user_id });

        const follower_id = await Users.findOne({ _id: id });


        if (!userFound) {
            return res.status(404).json({ message: 'no user was found wit this id' });

        } else {

            let update_following = {};

            update_following = {
                "$push": {
                    "following": id,
                }
            };

            await Users.findOne({ _id: user_id },);
            const userFound = await Users.updateOne({ _id: user_id });

            switch (follower_id.user_type) {
                case 0:
                    await Teams.updateOne({ _id: userFound.team }, update_following)
                    break;
                case 1:
                    await Refrees.updateOne({ _id: userFound.refree }, update_following)
                    break;
                case 2:
                    await Teams.updateOne({ _id: id }, update_following)
                    break;
                case 4:
                    await Staduims.updateOne({ _id: userFound.staduim }, update_following)
                    break;
                case 5:
                    await Players.updateOne({ _id: userFound.player }, update_following)
                    break;
                default:
                    break;
            }

            let update = {
                "$push": {
                    "followers": user_id,
                }
            };

            switch (follower_id.user_type) {
                case 0:
                    await Teams.updateOne({ _id: id }, update)
                    break;
                case 1:
                    await Refrees.updateOne({ _id: id }, update)
                    break;
                case 2:
                    await Teams.updateOne({ _id: id }, update)
                    break;
                case 4:
                    await Staduims.updateOne({ _id: id }, update)
                    break;
                case 5:
                    await Players.updateOne({ _id: id }, update)
                    break;
                default:
                    break;
            }
            return res.status(200).json({ "success": true, "message": "ok", "data": user });
        }

    } catch (error) {

    }
}


controller.getProfile = async (req, res,) => {
    const userId = req.body.userId;
  
    console.log(userId)
    if (!userId) {
      return res.status(401).json({ message: 'invalid userId' });
    }
  
    try {
  
      const userFound = await Users.findOne({ _id: userId });
  
      if (!userFound) {
  
        return res.status(404).json({ message: 'no user was found wit this id' });
      } else {
        console.log(userFound.user_type)
        let path = getPath(userFound.user_type);
        console.log(path.toString());
        const user = await Users.findOne({ _id: userId }).populate(path.toString());
  
        user.password = "";
        return res.status(200).json({ "success": true, "message": "ok", "data": user });
      }
    } catch (error) {
      return AppError.onError(res, "error" + error);
    }
  };


module.exports = controller;