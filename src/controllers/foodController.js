const AppError = require("./errorController");
const Food = require("../models/food");
const Restaurant = require("../models/restaurant");

const ITEM_PER_PAGE = 50;
/**
 * PUBLIC ACCESS
 */


exports.addFood = (req, res, next) => {
  const restaurantId = req.params.id;
  const name = req.body.name;
  const description = req.body.description;
  const category = req.body.category;
  const price = req.body.price;
  const readyTime = req.body.readyTime;

  let currentRestaurant;

  Restaurant.findById(restaurantId)
    .then((restaurant) => {
      currentRestaurant = restaurant;
      let food = new Food({
        name: name,
        description: description,
        category: category,
        rating: 0,
        price: price,
        images: [],
        readyTime: readyTime,
      });

      return food.save();
    })
    .then((food) => {
      currentRestaurant.foods.push(food);
      return currentRestaurant.save();
    })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      err.statusCode = 503;
      next(err);
    });
};

exports.getAvailableFoods = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalFoods;
  Food.find()
    .countDocuments()
    .then((numbersOfFoods) => {
      totalFoods = numbersOfFoods;
      return Food.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then((foods) => {
      return res.status(200).json(foods);
    })
    .catch((err) => {
      err.statusCode = 503;
      next(err);
    });
};

/**
 * Get Top 10 restaurants in specified Area
 */
exports.getTopRestaurants = (req, res, next) => {
  Restaurant.find()
    .populate("foods")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      return AppError.onError(res, "restaurant add error" + err);
    });
};

exports.getAllFoodsFromRestaurant = (req, res, next) => {
  const restaurantId = req.params.id;
  Restaurant.findById(restaurantId)
    .populate("foods")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      err.statusCode = 503;
      next(err);
    });
};

exports.getFoodDetails = (req, res, next) => {
  const foodId = req.params.id;
  Food.findById(foodId)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      err.statusCode = 503;
      next(err);
    });
};

exports.getInThirtyMinutes = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalFoods;
  Food.find({ readyTime: { $lt: 31 } })
    .countDocuments()
    .then((numbersOfFoods) => {
      totalFoods = numbersOfFoods;
      return Food.find({ readyTime: { $lt: 31 } })
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then((foods) => {
      return res.status(200).json(foods);
    })
    .catch((err) => {
      err.statusCode = 503;
      next(err);
    });
};
