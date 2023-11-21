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

const fileUpload = require('express-fileupload')

const app = express()

app.use(fileUpload())

const { UPLOAD_DIR } = require("./settings");


app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

app.use(bodyParser.json())



app.use('/api', routes);


app.post("/", (req, res) => {

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
