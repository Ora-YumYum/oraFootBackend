const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("./errorController");
const { APP_KEY } = require("../config/AppConst");
const { validationResult } = require("express-validator");

const User = require("../models/users/users");
const Teams = require("../models/users/Teams");
const Refeers = require("../models/users/refeers");
const Photographers = require("../models/users/photographers");
const Doctor = require("../models/users/doctor");
const staduims = require("../models/users/staduims");
const players = require("../models/users/players");



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

  const { email, password, firstName, lastName, gender, username, user_type, phone_number, } = req.body;
  console.log(req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User({
      username, email, password: hashedPassword, first_name: firstName,
      last_name: lastName, gender: gender, username: username,
      phone_number: phone_number,
      user_type: user_type
    });

    switch (user_type) {
      case 0:
        const team = Teams(req.body.team)
        await team.save();
        user.team = team;
        break;
      case 1:
        const refeere = Refeers(req.body.refeere)
        await refeere.save();
        user.refeere = refeere;
      case 2:
        const photographer = Photographers(req.body.photographer);
        await photographer.save();
        user.photographer = photographer;
      case 3:
        const doctor = Doctor(req.body.doctor)
        await doctor.save();
        user.doctor = doctor;
      case 4:
        const staduim = staduims(req.body.staduim);
        await staduim.save();
        user.staduim = staduim;
      case 5:
        const player = players(req.body.player);
        await player.save();
        user.player = player;
      default:
        break;
    }


    await user.save();
    const token = jwt.sign(
      { user_id: user._id.toString(), email: user.email, },
      process.env.SECRET_KEY,
      { expiresIn: "90d" }
    );
    res.json({ success: true, msg: 'Registration successful', token: token, });
  } catch (error) {
    return AppError.onError(res, "error" + error);

  }
};

exports.onForgotPassword = (req, res, next) => {


};

controller.onLogin = async (req, res,) => {

  const { phone_number, password } = req.body;

  if (!phone_number || !password) {
    return res.status(400).json({ message: 'invalid phone number or password' });
  }

  try {
    const userFound = await User.findOne({ phone_number });
    if (!userFound) {
      return res.status(404).json({ message: 'User not found' });
    }

    var passwordMatch = bcrypt.compareSync(
      password,
      userFound.password,
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }


    let path = getPath(userFound.user_type);


    const user = await User.findOne({ phone_number }).populate(path.toString());

    user.password = "";
    const token = jwt.sign({ user_id: user._id.toString(), email: user.email, }, process.env.SECRET_KEY, {
    });

    res.json({ "token": token, "user": user });
  } catch (error) {
    console.log(error);
    return AppError.onError(res, "error" + error);
  }
};


controller.getProfile = async (req, res,) => {
  const userId = req.body.userId;

  if (!userId) {
    return res.status(401).json({ message: 'invalid userId' });
  }

  try {
    let path = getPath(userFound.user_type);

    const user = await User.findOne({ phone_number }).populate(path.toString());

    user.password = "";

    res.json({ "success": true, "msg": "ok", "data": user });

    if (!user) {
      return res.status(404).json({ message: 'no user was found wit this id' });
    }
  } catch (error) {
    return AppError.onError(res, "error" + error);
  }
};

controller.getCart = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .populate("cart.food")
    .then((user) => {
      res.status(200).json(user.cart);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

controller.addToCart = (req, res, next) => {
  const userId = req.userId;
  const foodId = req.params.id;

  console.log("Going through");

  let currentUser;
  User.findById(userId)
    .populate("cart.food")
    .then((user) => {
      currentUser = user;
      return Food.findById(foodId);
    })
    .then((food) => {
      return currentUser.addToCart(food);
    })
    .then((result) => {
      res.status(200).json(result.cart);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

controller.editCart = (req, res, next) => {
  const userId = req.userId;
  const foodId = req.params.id;
  const qty = req.params.qty;

  let currentUser;
  User.findById(userId)
    .populate("cart.food")
    .then((user) => {
      currentUser = user;
      return Food.findById(foodId);
    })
    .then((food) => {
      return currentUser.editCart(food, qty);
    })
    .then((result) => {
      res.status(200).json(result.cart);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

controller.getOrder = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .populate("order")
    .then((user) => {
      res.status(200).json(user.order);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

controller.getSelectedOrder = (req, res, next) => {
  const orderId = req.params.id;

  Order.findById(orderId)
    .populate("items")
    .then((order) => {
      res.status(200).json(order);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

controller.addOrder = (req, res, next) => {
  const userId = req.userId;
  const orderId = `${Math.floor(Math.random() * 89999 + 1000)}`;
  let currentUser;
  let total = 0;
  User.findById(userId)
    .populate("order")
    .populate("cart.food")
    .then((user) => {
      currentUser = user;
      let orderedItems = [];
      user.cart.map((item) => {
        let qty = item.qty;
        let price = item.food.price;
        total += qty * price;
        orderedItems.push(item.food);
      });

      let order = new Order({
        orderID: orderId,
        items: orderedItems,
        totalAmount: total,
        orderDate: new Date(),
        paidThrough: "",
        paymentResponse: "",
        orderStatus: "waiting",
      });
      return order.save();
    })
    .then((order) => {
      currentUser.order.push(order);
      currentUser.cart = [];
      return currentUser.save();
    })
    .then((result) => res.status(200).json(result.order))
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

controller.viewProfile = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .select("-password")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

controller.editAddress = (req, res, next) => {
  const userId = req.userId;
  const address = req.body.address;
  const lat = req.body.lat;
  const lng = req.body.lng;
  const phone = req.body.phone;

  User.findById(userId)
    .select("-password")
    .then((user) => {
      user.address = address;
      user.phone = phone;
      user.lat = lat;
      user.lng = lng;
      return user.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


module.exports = controller;