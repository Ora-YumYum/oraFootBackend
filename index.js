const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet"); // secure headers
const compression = require("compression"); // compress assets
const morgan = require("morgan"); // logging
const { MONGODB_URI } = require("./src/config/AppConst");
const formidable = require("express-formidable")

const routes = require("./src/routes/index")

const fileUpload = require('express-fileupload')

const app = express()
app.use(fileUpload())
app.use(formidable())
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);



mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => { })
  .catch((err) => {
    console.log(err);
  });


app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const data = error.data;
  res.status(status).json({ data: data });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);
console.log("listening on port 8000");
