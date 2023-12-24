const path = require("path");

const express = require("express");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const helmet = require("helmet");

const cors = require('cors')

const morgan = require("morgan");

const formidable = require("express-formidable")

const routes = require("./src/routes/index")

require('dotenv').config()


const multer  = require('multer');
const includeMulter = multer().any();

require('./util/readenv').config();

const app = express()



const { UPLOAD_DIR } = require("./settings");


app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

app.use(bodyParser.json())

app.use('/api', routes);

//multer options

app.get("/", (req, res) => {
  try {
    console.log(req.body.email);
    return res.send({
      "success": true,
      "message": ""
    });
  } catch (error) {
    return res.send({ "error": error })
  }
})

function shouldParseRequest(req) {
  const currentMethod = req.method;
  const currentRoute = req.originalUrl;

  const restrictedRoutes = [{
    method: 'POST', originalUrl: '/'
  }];

  for(var i = 0; i < restrictedRoutes.length; i++ ) {
    if(restrictedRoutes[i].method == currentMethod && restrictedRoutes[i].originalUrl == currentRoute ) {
      return false;
    }
  }
  return true;
}

app.use(function(req, res, next) {
  shouldParseRequest(req) ? includeMulter(req, res, next) : next();
});



mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => { })
  .catch((err) => {
    console.log(err);
  });


const PORT = process.env.PORT;


const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

app.use(cors(corsOptions))

app.use(express.static(UPLOAD_DIR));

app.listen(PORT);


console.log("listening on port " + PORT);
