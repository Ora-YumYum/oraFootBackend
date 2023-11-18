const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    const err = new Error("Authorization error");
    err.statusCode = 401;
    throw err;
  }


  const token = authorization.split(" ")[1];
  let decodedToken;

  if (token != undefined || token != null || token == "Token") {
    try {
      decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }

    if (!decodedToken) {
      const err = new Error("unable  to authenticated");
      err.statusCode = 401;
      throw err;
    }

    req.userId = decodedToken.user_id;
    next();
  } else {
    const err = new Error("unable  to authenticated");
    err.statusCode = 401;
    return res.status(401).send({
      "success": false,
      "msg": "unable  to authenticate",
    });
  }

};
