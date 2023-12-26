const path = require("path");

const express = require("express");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");

var fileupload = require("express-fileupload");


const helmet = require("helmet");

const cors = require('cors')

const morgan = require("morgan");


const routes = require("./src/routes/index")

require('dotenv').config()


const multer = require('multer');
const includeMulter = multer().any();

require('./util/readenv').config();

const app = express()



const { UPLOAD_DIR } = require("./settings");




app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileupload());

app.use('/api', routes);

//multer options

app.get("/", (req, res) => {
  try {

    return res.send({
      "success": true,
      "message": ""
    });
  } catch (error) {
    return res.send({ "error": error })
  }
})





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
