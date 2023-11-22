const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const AppError = require("./errorController");
const { APP_KEY } = require("../config/AppConst");
const fs = require('file-system');

const { validationResult } = require("express-validator");
const { imageComproser } = require("../config/image-compr")
const User = require("../models/users/users");
const Teams = require("../models/users/Teams");
const Refeers = require("../models/users/refeers");
const Photographers = require("../models/users/photographers");
const Doctor = require("../models/users/doctor");
const staduims = require("../models/users/staduims");
const players = require("../models/users/players");
const { UPLOAD_DIR } = require("../../settings");


const compressImages = require("compress-images")

const fileSystem = require('file-system');

let controller = {}


function getPath(user_type) {
  let path = "";

  switch (user_type) {
    case 0:
      path = "team";
      break;
    case 1:

      path = "refeers";
    case 2:

      path = "photographer";
    case 3:

      path = "doctor";
    case 4:

      path = "staduim";
    case 5:

      path = "player";
    default:
      break;
  }

  return path;
}

controller.onSignup = async (req, res,) => {

  const { email, password, firstName, lastName, phone_number, username, } = req.body;

  let user_type = Number.parseInt(req.body.user_type)
  let gender = Number.parseInt(req.body.gender)






  try {
    const hashedPassword = await bcryptjs.hash(password, 10);


    const userExits = await User.findOne({ "phone_number": phone_number });

    if (userExits) {


      return res.status(200).send({
        success: false, message:
          'user already exits with this phone number',
      });
    } else {
      const user = User({
        email: email, password: hashedPassword, first_name: firstName,
        last_name: lastName, gender: gender, username: username,
        phone_number: phone_number,
        user_type: user_type,
       
        fcm_token: "",
      });

      if (req.body.wilaya != undefined) {
        let wilaya = Number.parseInt(req.body.wilaya)
        user.wilaya = wilaya;
      }

      switch (user_type) {
        case 0:

          if (req.files != undefined) {
            let team_data = JSON.parse(req.body.team);
            let team_wilaya = Number.parseInt(team_data.wilaya);
            try {
              let userPic = req.files.image;

              let pic_name = (new Date().getTime()) + "-" + userPic.name;

              let uploadPath = UPLOAD_DIR + "/users/";

              const filePath = UPLOAD_DIR + "/temp-uploads/" + pic_name;

              uploadImage(filePath, uploadPath, userPic.data);
              const team = Teams({
                profile_img: pic_name,
                wilaya: team_wilaya,
                team_name: team_data.team_name,
                about: team_data.about,
                main_color: team_data.main_color,
                secondary_color: team_data.secondary_color,
              })
              await team.save();
              user.team = team;
            } catch (error) {
              console.log(error);
            }
          }

          break;
        case 1:
          const refeere = Refeers({ profile_img: "" })

          if (req.files != undefined) {
            try {
              let userPic = req.files.image;

              let pic_name = (new Date().getTime()) + "-" + userPic.name;

              let uploadPath = UPLOAD_DIR + "/users/";

              const filePath = UPLOAD_DIR + "/temp-uploads/" + pic_name;

              refeere.profile_img = pic_name;
              uploadImage(filePath, uploadPath, userPic.data);
              await refeere.save();
              user.refeere = refeere;
            } catch (error) {
              console.log(error);
            }
          }

          break;
        case 2:
          const photographer = Photographers(req.body.photographer);

          if (req.files != undefined) {

            try {
              let userPic = req.files.image;

              let pic_name = (new Date().getTime()) + "-" + userPic.name;

              let uploadPath = UPLOAD_DIR + "/users/";


              const filePath = UPLOAD_DIR + "/temp-uploads/" + pic_name;

              refeere.profile_img = pic_name;
              uploadImage(filePath, uploadPath, userPic.data);
              await photographer.save();
              user.photographer = photographer;
            } catch (error) {
              console.log(error);
            }

          }
          user.photographer = photographer;
          break;
        case 3:
          const doctor = Doctor(req.body.doctor)
          await doctor.save();
          user.doctor = doctor;
          break;
        case 4:
          let staduim_data = JSON.parse(req.body.staduim);
          let price_per_hour = Number.parseFloat(staduim_data.price_per_hour)
          let price_per_month = Number.parseFloat(staduim_data.price_per_month)
          let price_per_year = Number.parseFloat(staduim_data.price_per_year)
          let wilaya = Number.parseInt(staduim_data.wilaya);
          const staduim = staduims({
            price_per_year: price_per_year,
            price_per_month: price_per_month,
            price_per_hour: price_per_hour,
            staduim_name: staduim_data.staduim_name,
            wilaya: wilaya
          });
          await staduim.save();
          user.staduim = staduim;
          break;
        case 5:

          if (req.files != undefined) {
            const player = players(req.body.player);
            try {
              let userPic = req.files.image;

              let pic_name = (new Date().getTime()) + "-" + userPic.name;

              let uploadPath = UPLOAD_DIR + "/users/";

              const filePath = UPLOAD_DIR + "/temp-uploads/" + pic_name;
              player.profile_img = pic_name;
              player.user_id = user._id;
              user.profile_img = pic_name;
              uploadImage(filePath, uploadPath, userPic.data);
              await player.save();
              user.player = player;
            } catch (error) {
              console.log(error);
            }
          }

        default:
          break;
      }
      await user.save();
      let token = jwt.sign(
        { user_id: user._id.toString(), email: user.email, },
        process.env.SECRET_KEY,
        { expiresIn: "90d" }
      );
      res.json({ success: true, message: 'Registration successful', token: token, });
    }
  } catch (error) {
    console.log(error);
    return AppError.onError(res, "error" + error);
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


controller.onLogin = async (req, res,) => {

  const { phone_number, password } = req.body;

  if (!phone_number || !password) {
    return res.status(400).json({ message: 'invalid phone number or password' });
  }

  try {
    const userFound = await User.findOne({ phone_number });
    if (!userFound) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    var passwordMatch = bcryptjs.compareSync(
      password,
      userFound.password,
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }


    let path = getPath(userFound.user_type);


    const user = await User.findOne({ phone_number }).populate(path.toString());

    user.password = "";
    const token = jwt.sign({ user_id: user._id.toString(), phone_number: user.phone_number, }, process.env.SECRET_KEY, {
    });

    res.json({ "success": true, message: "ok", "token": token, "user": user });
  } catch (error) {
    console.log(error);
    return AppError.onError(res, "error" + error);
  }
};


controller.getProfile = async (req, res,) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: 'invalid userId' });
  }

  try {
    let path = getPath(userFound.user_type);

    const user = await User.findOne({ phone_number }).populate(path.toString());

    user.password = "";

    res.json({ "success": true, "message": "ok", "data": user });

    if (!user) {
      return res.status(404).json({ message: 'no user was found wit this id' });
    }
  } catch (error) {
    return AppError.onError(res, "error" + error);
  }
};



controller.checkPhoneNumber = async (req, res) => {

  const phone_number = req.body.phone_number;


  try {
    const exists = await User.findOne({ phone_number: phone_number, });

    if (exists) {
      console.log("user exists");
      res.json({ success: true, message: "user exists", resutls: true }).status(200);
    } else {
      res.json({ success: true, message: "user don't exists", resutls: false }).status(200);
    }
  } catch (error) {
    res.json({ success: false, message: "error" }).status(500);
  }
}


controller.checkPassword = async (req, res) => {
  const { password } = req.body;
  const id = req.user.user_id;

  try {
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      return res.status(200).send({
        success: false, message:
          'there"s no accounts with this Email', reutls: null
      })
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      user.password
    )
    if (isPasswordValid) {
      return res.status(200).send({
        success: true, message: 'ok', resutls: true
      })
    } else {
      return res.json({ success: false, message: 'wrong password', resutls: false })
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: 'Server Error', resutls: null })

  }
}

controller.updatePassowrd = async (req, res) => {
  const { old_password, password } = req.body;
  const id = req.useId;
  try {
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      return res.status(200).send({ success: false, message: 'there"s No Account with this Email', reutls: null })
    }
    const isPasswordValid = await bcryptjs.compare(
      old_password,
      user.password
    )
    if (isPasswordValid) {
      const newPassword = await bcryptjs.hash(password, 10);
      const updatePassw = await User.updateOne({
        _id: id,
      }, {
        $set: {
          "password": newPassword
        }
      });
      return res.status(200).send({
        success: true, message: 'ok', reutls: "password was reset successfuly"
      })
    } else {
      return res.json({ success: false, message: 'wrong password', user: false })
    }
  } catch (error) {
    return res.status(500).send({ success: false, message: 'Server Error', resutls: null })

  }
}


controller.resetPassowrd = async (req, res) => {
  const { phone_number, password } = req.body;

  try {
    const user = await User.findOne({
      phone_number: phone_number,
    });
    if (!user) {
      return res.status(200).send({ success: false, message: 'there"s no account with this phone number', reutls: null })
    }
    const newPassword = await bcryptjs.hash(password, 10);
    await User.updateOne({
      _id: user._id,
    }, {
      $set: {
        "password": newPassword
      }
    });
    return res.status(200).send({
      success: true, message: 'ok', reutls: "password was reset successfuly"
    })
  } catch (error) {
    return res.status(500).send({ success: false, message: 'Server Error', resutls: null })

  }
}

controller.findAccount = async (req, res) => {
  const { phone_number } = req.body;

  try {
    const user = await User.findOne({
      phone_number: phone_number,
    });
    if (!user) {
      return res.status(200).send({ success: false, message: 'there"s no account with this phone number', reutls: false })
    } else {
      res.status(200).send({
        success: true, message: 'ok', reutls: true,
      })
    }

  } catch (error) {
    return res.status(500).send({ success: false, message: 'Server Error', resutls: null })

  }
}


controller.updateToken = async (req, res) => {
  const { token, } = req.body;
  const userId = req.userId;

  const options = { upsert: true };

  try {
    let response = await User.updateOne({
      _id: userId,
    }, {
      $set: {
        "fcm_token": token
      }
    });
    return res.status(200).send({
      success: true, message: 'ok', reutls: "token was updated successfully"
    })
  } catch (error) {
    return res.status(500).send({ success: false, message: 'Server Error', resutls: null })

  }
}

module.exports = controller;