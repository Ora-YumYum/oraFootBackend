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

exports.onSignup = async (req, res,) => {

  const { email, password, firstName, lastName, gender, username, user_type, } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User({
      username, email, password: hashedPassword, first_name: firstName,
      last_name: lastName, gender: gender, username: username,
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
      APP_KEY,
      { expiresIn: "90d" }
    );
    res.json({ message: 'Registration successful', token: token });
  } catch (error) {
    next(error);
  }
};

exports.onForgotPassword = (req, res, next) => {

  
 };

exports.onLogin = async (req, res,) => {

  const { phone_number, password } = req.body;

  try {
    const user = await User.findOne({ phone_number });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {

    });
    res.json({ token });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getCart = (req, res, next) => {
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

exports.addToCart = (req, res, next) => {
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

exports.editCart = (req, res, next) => {
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

exports.getOrder = (req, res, next) => {
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

exports.getSelectedOrder = (req, res, next) => {
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

exports.addOrder = (req, res, next) => {
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

exports.viewProfile = (req, res, next) => {
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

exports.editAddress = (req, res, next) => {
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
